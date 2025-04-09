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

// Definición de iconos SVG
const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  ),
  CheckSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
    </svg>
  ),
  Times: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  ),
  TrashAlt: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
    </svg>
  ),
  FileUpload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  )
};

// Styled Components
const Container = styled.div`
  padding: 30px;
  max-width: 1300px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaedf0;
`;

const Title = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  background-color: #1976d2;
  color: white;

  &:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
  }

  &.delete-selected {
    background-color: #f44336;

    &:hover {
      background-color: #d32f2f;
      box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
    }
  }

  &.cancel-selection {
    background-color: #78909c;
    
    &:hover {
      background-color: #607d8b;
      box-shadow: 0 4px 8px rgba(120, 144, 156, 0.3);
    }
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  
  input[type="file"] {
    flex: 1;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background-color: #fff;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  background-color: #f5f7fa;
  color: #2c3e50;
  font-weight: 600;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #e0e6ed;
`;

const Td = styled.td`
  padding: 15px;
  color: #3c4858;
  border-bottom: 1px solid #eaedf0;
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f9ff;
  }

  &.selected {
    background-color: #e3f2fd;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const ActionsCell = styled.td`
  padding: 12px 15px;
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

const ActionIconButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;

  &.edit {
    background-color: #4caf50;
    &:hover {
      background-color: #388e3c;
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(76, 175, 80, 0.3);
    }
  }

  &.delete {
    background-color: #f44336;
    &:hover {
      background-color: #d32f2f;
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(244, 67, 54, 0.3);
    }
  }

  &.view {
    background-color: #2196f3;
    &:hover {
      background-color: #1976d2;
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(33, 150, 243, 0.3);
    }
  }
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  color: #78909c;
  
  h3 {
    margin-bottom: 15px;
    color: #546e7a;
  }
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  width: 300px;
  margin-left: auto;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
  
  &.instock {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  &.lowstock {
    background-color: #fff8e1;
    color: #f57f17;
  }
  
  &.outofstock {
    background-color: #ffebee;
    color: #c62828;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background-color: #f5f7fa;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #e3f2fd;
    color: #1976d2;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  color: #546e7a;
  font-weight: 500;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
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
          
          // Nuevos campos agregados:
          // Precio de venta (numérico)
          price: parseNumeric(row['Precio Venta']),
          
          // Categoría (texto)
          category: row['Categoria']?.toString() ?? '',
          
          // Descripción corta (texto)
          short_description: row['Descripcion']?.toString() ?? '',
  
          // Campos extra que no estén en el Excel, se mantienen con valores por defecto
          discount: 0,
          rating: 0,
          affiliate_link: '',
          color: '',
          size: '',
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
    
    if (window.confirm(`¿Estás seguro de eliminar ${selectedProducts.length} productos?`)) {
      try {
        // Eliminar imágenes asociadas
        await deleteImagesForProducts(selectedProducts);
        
        // Eliminar productos
        const { error } = await supabase
          .from('products')
          .delete()
          .in('id', selectedProducts);

        if (error) {
          console.error('Error deleting products:', error);
          alert('Error al eliminar productos');
          return;
        }

        // Actualizar lista
        setProducts(products.filter((product) => !selectedProducts.includes(product.id)));
        setSelectedProducts([]);
        setMultiSelect(false);
        alert('Productos eliminados correctamente');
      } catch (error) {
        console.error('Error in delete process:', error);
        alert('Error en el proceso de eliminación');
      }
    }
  };

  // ==============================
  // Manejo de borrado individual
  // ==============================
  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        // Eliminar imágenes asociadas
        await deleteImagesForProducts([id]);
        
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          console.error(error);
          alert('Error al eliminar el producto');
          return;
        }
        
        setProducts(products.filter((product) => product.id !== id));
        alert('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error in delete process:', error);
        alert('Error en el proceso de eliminación');
      }
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

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getStockStatus = (stock) => {
    if (stock <= 0) return { class: 'outofstock', text: 'Sin Stock' };
    if (stock < 5) return { class: 'lowstock', text: 'Stock Bajo' };
    return { class: 'instock', text: 'Disponible' };
  };

  return (
    <Container>
      <PageHeader>
        <Title>Administración de Productos</Title>
        <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
      </PageHeader>

      <ActionsContainer>
        <ActionButton onClick={handleCreateProduct}>
          <Icons.Plus /> Crear Producto
        </ActionButton>

        {!multiSelect ? (
          <ActionButton onClick={() => setMultiSelect(true)}>
            <Icons.CheckSquare /> Selección Múltiple
          </ActionButton>
        ) : (
          <>
            <ActionButton className="cancel-selection" onClick={() => {
              setMultiSelect(false);
              setSelectedProducts([]);
            }}>
              <Icons.Times /> Cancelar Selección
            </ActionButton>
            <ActionButton 
              className="delete-selected" 
              onClick={handleDeleteSelected}
              disabled={selectedProducts.length === 0}
            >
              <Icons.TrashAlt /> Eliminar Seleccionados ({selectedProducts.length})
            </ActionButton>
          </>
        )}

        <FileInputContainer>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          <ActionButton onClick={handleUploadExcel} disabled={!excelFile}>
            <Icons.FileUpload /> Importar Excel
          </ActionButton>
        </FileInputContainer>

        <SearchInput 
          type="text" 
          placeholder="Buscar productos..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </ActionsContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              {multiSelect && <Th width="40px"></Th>}
              <Th>Código</Th>
              <Th>Lote</Th>
              <Th>Artículo</Th>
              <Th>Stock</Th>
              <Th>Estado</Th>
              <Th>Costo</Th>
              <Th>Precio</Th>
              <Th>Descuento</Th>
              <Th>Categoría</Th>
              <Th width="120px">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <Tr 
                    key={product.id}
                    className={selectedProducts.includes(product.id) ? 'selected' : ''}
                  >
                    {multiSelect && (
                      <Td>
                        <Checkbox
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </Td>
                    )}
                    <Td>{product.code}</Td>
                    <Td>{product.batch}</Td>
                    <Td>{product.name}</Td>
                    <Td>{product.stock}</Td>
                    <Td>
                      <StatusBadge className={stockStatus.class}>
                        {stockStatus.text}
                      </StatusBadge>
                    </Td>
                    <Td>${product.purchase_cost?.toLocaleString()}</Td>
                    <Td>${product.price?.toLocaleString()}</Td>
                    <Td>{product.discount}%</Td>
                    <Td>{product.category}</Td>
                    <ActionsCell>
                      <ActionIconButton
                        className="view"
                        onClick={() => handleViewProduct(product)}
                        title="Ver detalles"
                      >
                        <Icons.Eye />
                      </ActionIconButton>
                      <ActionIconButton
                        className="edit"
                        onClick={() => handleEditProduct(product)}
                        title="Editar producto"
                      >
                        <Icons.Edit />
                      </ActionIconButton>
                      <ActionIconButton
                        className="delete"
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Eliminar producto"
                      >
                        <Icons.TrashAlt />
                      </ActionIconButton>
                    </ActionsCell>
                  </Tr>
                );
              })
            ) : (
              <tr>
                <Td colSpan={multiSelect ? 11 : 10} style={{ textAlign: 'center' }}>
                  <EmptyState>
                    <h3>No hay productos para mostrar</h3>
                    <p>{searchTerm ? 'Intenta con otra búsqueda' : 'Agrega nuevos productos haciendo clic en "Crear Producto"'}</p>
                  </EmptyState>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableContainer>

      {filteredProducts.length > productsPerPage && (
        <Pagination>
          <PaginationButton 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <Icons.ChevronLeft /> Anterior
          </PaginationButton>
          
          <PaginationInfo>
            Página {currentPage} de {totalPages}
          </PaginationInfo>
          
          <PaginationButton 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente <Icons.ChevronRight />
          </PaginationButton>
        </Pagination>
      )}

      {showCreateModal && (
        <ProductCreateModal onClose={handleCloseCreateModal} refreshProducts={fetchProducts} />
      )}

      {showEditModal && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false);
            fetchProducts();
          }}
        />
      )}

      {showViewModal && (
        <ProductViewModal
          product={viewingProduct}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </Container>
  );
};

export default ProductList;
