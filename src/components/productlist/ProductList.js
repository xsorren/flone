// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ProductEditModal from './ProductEditModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

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

const Actions = styled.div`
    margin-bottom: 15px;
    display: flex;
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
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.get('/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
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
        try {
            await Promise.all(
                selectedProducts.map((id) =>
                    axios.delete(`/api/products/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );
            fetchProducts();
            setSelectedProducts([]);
            setMultiSelect(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleViewProduct = (id) => {
        navigate(`/products/${id}`);
    };

    return (
        <Container>
            <Header>
                <Title>Listado de Productos</Title>
                <LogoutButton onClick={handleLogout}>Cerrar Sesión</LogoutButton>
            </Header>

            <Actions>
                {multiSelect ? (
                    <>
                        <ActionButton className="delete-selected" onClick={handleDeleteSelected}>
                            Eliminar Seleccionados
                        </ActionButton>
                        <ActionButton className="cancel-selection" onClick={() => {
                            setMultiSelect(false);
                            setSelectedProducts([]);
                        }}>
                            Cancelar Selección
                        </ActionButton>
                    </>
                ) : (
                    <ActionButton onClick={() => setMultiSelect(true)}>
                        Seleccionar Múltiples
                    </ActionButton>
                )}
            </Actions>

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
                    {products.map((product) => (
                        <Tr key={product._id}>
                            {multiSelect && (
                                <Td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={() => handleSelectProduct(product._id)}
                                    />
                                </Td>
                            )}
                            <Td>{product.code}</Td>
                            <Td>{product.name}</Td>
                            <Td>{product.stock}</Td>
                            <ActionsCell>
                                {!multiSelect && (
                                    <>
                                        <Button className="edit" onClick={() => handleEditProduct(product)}>
                                            Editar
                                        </Button>
                                        <Button className="delete" onClick={() => handleDeleteProduct(product._id)}>
                                            Eliminar
                                        </Button>
                                        <Button className="view" onClick={() => handleViewProduct(product._id)}>
                                            Ver
                                        </Button>
                                    </>
                                )}
                            </ActionsCell>
                        </Tr>
                    ))}
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
        </Container>
    );
};

export default ProductList;