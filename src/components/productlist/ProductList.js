// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import ProductEditModal from './ProductEditModal';
import ProductViewModal from './ProductViewModal';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProductCreateModal from './ProductCreateModal';
import { supabase } from '../../utils/supabaseClient';

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Consulta con left join implícito (sin !inner)
    const { data, error } = await supabase
    .from('products')
    .select(`
      id, code, batch, name, stock, category, purchase_cost, total_price, price, discount, rating, short_description, affiliate_link, created_at, updated_at,
      images (url)
    `);
  
  if (error) {
    console.error('Error fetching products with images:', error);
  } else {
    console.log('Fetched products with images:', data);
    setProducts(data); // Asegúrate de actualizar el estado con los datos obtenidos

  }
  
  };

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    fetchProducts();
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) return;
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

  const handleDeleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error(error);
    } else {
      fetchProducts();
    }
  };

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
            <ActionButton className="delete-selected" onClick={handleDeleteSelected}>
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
            <ActionButton onClick={() => setMultiSelect(true)}>Seleccionar Múltiples</ActionButton>
            <ActionButton onClick={handleCreateProduct}>Crear Nuevo Producto</ActionButton>
          </>
        )}
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
                      <Button className="edit" onClick={() => handleEditProduct(product)}>
                        Editar
                      </Button>
                      <Button className="delete" onClick={() => handleDeleteProduct(product.id)}>
                        Eliminar
                      </Button>
                      <Button className="view" onClick={() => handleViewProduct(product)}>
                        Ver
                      </Button>
                    </>
                  )}
                </ActionsCell>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={multiSelect ? 5 : 4} style={{ textAlign: 'center', padding: '20px' }}>
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
        <ProductCreateModal onClose={handleCloseCreateModal} refreshProducts={fetchProducts} />
      )}
    </Container>
  );
};

export default ProductList;
