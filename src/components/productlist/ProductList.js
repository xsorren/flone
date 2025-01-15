// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import ProductEditModal from './ProductEditModal';
import ProductViewModal from './ProductViewModal';
import ProductCreateModal from './ProductCreateModal';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../utils/supabaseClient';

// Para procesar archivos Excel
import * as XLSX from 'xlsx';

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const LogoutButton = styled.button`
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff7875;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #1890ff;
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #40a9ff;
  }

  &.delete-selected {
    background-color: #ff4d4f;

    &:hover {
      background-color: #ff7875;
    }
  }

  &.cancel-selection {
    background-color: #d9d9d9;
    color: #000;

    &:hover {
      background-color: #bfbfbf;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px 15px;
  text-align: left;
  background-color: #f5f5f5;
  color: #555;
`;

const Td = styled.td`
  padding: 12px 15px;
  color: #555;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
`;

const ActionsCell = styled.td`
  display: flex;
  gap: 5px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;

  &.edit {
    background-color: #52c41a;
    &:hover {
      background-color: #73d13d;
    }
  }

  &.delete {
    background-color: #ff4d4f;
    &:hover {
      background-color: #ff7875;
    }
  }

  &.view {
    background-color: #1890ff;
    &:hover {
      background-color: #40a9ff;
    }
  }
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // Para manejar el archivo Excel
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // 1. Traer productos con sus imágenes (left join).
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, code, batch, name, stock, category, purchase_cost, total_price, price, discount, rating, short_description, affiliate_link, created_at, updated_at,
        images (id, url)
      `);

    if (error) {
      console.error('Error fetching products with images:', error);
    } else {
      console.log('Fetched products with images:', data);
      setProducts(data || []);
    }
  };

  // ==============================
  // Manejo de archivo Excel
  // ==============================
  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleUploadExcel = async () => {
    if (!excelFile) return;
  
    try {
      // Leer el archivo como ArrayBuffer
      const data = await excelFile.arrayBuffer();
      // Parsear con SheetJS
      const workbook = XLSX.read(data);
      // Tomar la primera hoja
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // Convertir a JSON (cada fila del Excel será un objeto)
      const excelData = XLSX.utils.sheet_to_json(worksheet);
  
      // Ahora mapeamos cada fila de Excel a la estructura de tu tabla "products"
      // Ajusta los nombres de columna según tu Excel exacto
      const mappedData = excelData.map((row) => {
        // Si en Excel tienes un formato de precios con comas, puedes convertirlos a float.
        // Por ejemplo, si "row['Precio Total']" viene como "10.160,00", necesitarás
        // reemplazar el separador de miles/punto y convertir la coma decimal. 
        // Ejemplo rápido de parseo (ajústalo según necesites):
        const parseNumeric = (val) => {
          if (!val) return 0;
          // Quitar puntos de miles y reemplazar la coma decimal por punto
          // "10.160,00" -> "10160.00"
          const normalized = val.toString().replace(/\./g, '').replace(',', '.');
          return parseFloat(normalized) || 0;
        };
  
        return {
          code: row['Codigo']?.toString() ?? '',
          batch: row['Lote']?.toString() ?? '',
          name: row['Articulo'] ?? '',
  
          // Stock como entero
          stock: parseInt(row['Stock']) || 0,
  
          // Costo de compra (numérico)
          purchase_cost: parseNumeric(row['Costo Compra']),
  
          // Precio total (numérico)
          total_price: parseNumeric(row['Precio Total']),
  
          // Campos extra que no estén en el Excel, si quieres inicializarlos:
          price: 0,
          discount: 0,
          rating: 0,
          short_description: '',
          affiliate_link: '',
          category: '',
          color: '',
          size: '',
          tag: '',
          // Podrías agregar created_at y updated_at si quieres
          // o confiar en un trigger o default de la DB.
        };
      });
  
      // Insertar todo en la tabla "products"
      const { data: newProducts, error } = await supabase
        .from('products')
        .insert(mappedData);
  
      if (error) {
        console.error('Error subiendo productos desde Excel:', error);
        alert('Error subiendo productos desde Excel. Revisa la consola.');
      } else {
        console.log('Productos subidos:', newProducts);
        alert('Productos subidos correctamente');
        // Volvemos a recargar la lista de productos
        fetchProducts();
      }
    } catch (err) {
      console.error('Error al procesar el Excel:', err);
      alert('Error al procesar el archivo Excel. Revisa la consola.');
    }
  };
  

  // ==============================
  // Manejo de creación y edición
  // ==============================
  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    fetchProducts();
  };

  // ==============================
  // Manejo de selección múltiple
  // ==============================
  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;

    // Antes de borrar de la tabla products, borremos las imágenes asociadas
    await deleteImagesForProducts(selectedProducts);

    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', selectedProducts);

    if (!error) {
      fetchProducts();
      setSelectedProducts([]);
      setMultiSelect(false);
    } else {
      console.error(error);
    }
  };

  // ==============================
  // Manejo de borrado individual
  // ==============================
  const handleDeleteProduct = async (id) => {
    // Borrar imágenes asociadas primero
    await deleteImagesForProducts([id]);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
    } else {
      fetchProducts();
    }
  };

  // Función auxiliar para borrar imágenes de la DB y del bucket
  const deleteImagesForProducts = async (productIds) => {
    // 1. Traer todas las imágenes asociadas a los productos
    const { data: imagesData, error } = await supabase
      .from('images')
      .select('*')
      .in('product_id', productIds);

    if (error) {
      console.error('Error fetching images before delete:', error);
      return;
    }

    if (!imagesData || imagesData.length === 0) return;

    // 2. Borrar los archivos del bucket
    // Para ello, necesitamos las rutas exactas en `product-images`.
    // Asumimos que la URL pública es algo como:
    //   https://<tuProyecto>.supabase.co/storage/v1/object/public/product-images/products/<id>/...
    // Necesitamos extraer la parte "products/<id>/imagenes/..."
    for (const img of imagesData) {
      if (!img.url) continue;

      // Sacar la parte final de la URL (ruta del archivo en el bucket).
      // Ejemplo de URL: 
      //   https://xxxx.supabase.co/storage/v1/object/public/product-images/products/123/imagen1.png
      // Necesitamos "products/123/imagen1.png"
      // Ajusta esta expresión regular según tu dominio:
      const pathMatch = img.url.match(/product-images\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        const path = pathMatch[1];
        // Borrarlo del bucket
        await supabase.storage
          .from('product-images')
          .remove([path]);
      }
    }

    // 3. Borrar los registros de la tabla images
    await supabase
      .from('images')
      .delete()
      .in('id', imagesData.map((img) => img.id));
  };

  // ==============================
  // Manejo de edición / vista
  // ==============================
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <Title>Listado de Productos</Title>
        <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
      </Header>

      <ActionsContainer>
        {multiSelect ? (
          <>
            <ActionButton
              className="delete-selected"
              onClick={handleDeleteSelected}
            >
              Eliminar Seleccionados
            </ActionButton>
            <ActionButton
              className="cancel-selection"
              onClick={() => {
                setMultiSelect(false);
                setSelectedProducts([]);
              }}
            >
              Cancelar Selección
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton onClick={() => setMultiSelect(true)}>
              Seleccionar Múltiples
            </ActionButton>
            <ActionButton onClick={handleCreateProduct}>
              Crear Nuevo Producto
            </ActionButton>
          </>
        )}

        {/* Botón para subir archivo Excel */}
        <ActionButton>
          <label htmlFor="excelFile" style={{ cursor: 'pointer' }}>
            Subir Excel
          </label>
        </ActionButton>
        <input
          id="excelFile"
          type="file"
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <ActionButton onClick={handleUploadExcel}>
          Procesar Excel
        </ActionButton>
      </ActionsContainer>

      <Table>
        <thead>
          <Tr>
            {multiSelect && <Th>Seleccionar</Th>}
            <Th>Código</Th>
            <Th>Artículo</Th>
            <Th>Stock</Th>
            <Th>Acciones</Th>
          </Tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <Tr key={product.id}>
                {multiSelect && (
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </Td>
                )}
                <Td>{product.code || 'Sin código'}</Td>
                <Td>{product.name}</Td>
                <Td>{product.stock || 0}</Td>
                <ActionsCell>
                  {!multiSelect && (
                    <>
                      <Button
                        className="edit"
                        onClick={() => handleEditProduct(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        className="delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        className="view"
                        onClick={() => handleViewProduct(product)}
                      >
                        Ver
                      </Button>
                    </>
                  )}
                </ActionsCell>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td
                colSpan={multiSelect ? 5 : 4}
                style={{ textAlign: 'center', padding: '20px' }}
              >
                No hay productos disponibles.
              </Td>
            </Tr>
          )}
        </tbody>
      </Table>

      {showEditModal && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}

      {showViewModal && (
        <ProductViewModal
          product={viewingProduct}
          onClose={() => {
            setShowViewModal(false);
            setViewingProduct(null);
          }}
        />
      )}

      {showCreateModal && (
        <ProductCreateModal
          onClose={handleCloseCreateModal}
          refreshProducts={fetchProducts}
        />
      )}
    </Container>
  );
};

export default ProductList;
