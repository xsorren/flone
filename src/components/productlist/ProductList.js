// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import ProductEditModal from './ProductEditModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const navigate = useNavigate()
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
        navigate('/login'); // Asegúrate de importar useNavigate
    };

    return (
        <div className="product-list-container">
            <h2>Listado de Productos</h2>
            <button onClick={handleLogout}>Cerrar Sesión</button>

            <div className="actions">
                {multiSelect ? (
                    <>
                        <button onClick={handleDeleteSelected}>Eliminar Seleccionados</button>
                        <button
                            onClick={() => {
                                setMultiSelect(false);
                                setSelectedProducts([]);
                            }}
                        >
                            Cancelar Selección
                        </button>
                    </>
                ) : (
                    <button onClick={() => setMultiSelect(true)}>Seleccionar Múltiples</button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        {multiSelect && <th>Seleccionar</th>}
                        <th>Código</th>
                        <th>Artículo</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            {multiSelect && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={() => handleSelectProduct(product._id)}
                                    />
                                </td>
                            )}
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.stock}</td>
                            <td>
                                {!multiSelect && (
                                    <>
                                        <button onClick={() => handleEditProduct(product)}>Editar</button>
                                        <button onClick={() => handleDeleteProduct(product._id)}>Eliminar</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
        </div>
    );
};

export default ProductList;
