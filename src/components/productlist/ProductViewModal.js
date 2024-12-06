// src/components/ProductViewModal.js
import React from 'react';
import axiosInstance from '../../utils/axiosInstance';
import styled from 'styled-components';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #1890ff;
  &:hover {
    background-color: #40a9ff;
  }
`;

const ProductViewModal = ({ product, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Detalles del Producto</h3>
        <p><strong>Código:</strong> {product.code}</p>
        <p><strong>Lote:</strong> {product.batch}</p>
        <p><strong>Artículo:</strong> {product.name}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Costo Compra:</strong> {product.purchaseCost}</p>
        <p><strong>Precio Total:</strong> {product.totalPrice}</p>
        <p><strong>Precio de Venta:</strong> {product.price}</p>
        <p><strong>Descuento:</strong> {product.discount}%</p>
        <p><strong>Descripción Corta:</strong> {product.shortDescription}</p>
        <p><strong>Categorías:</strong> {product.category.join(', ')}</p>
        <p><strong>Etiquetas:</strong> {product.tag.join(', ')}</p>
        <p><strong>Enlace de Afiliado:</strong> <a href={product.affiliateLink}>{product.affiliateLink}</a></p>

        {/* Mostrar imágenes */}
        {product.images && product.images.length > 0 && (
          <div>
            <h4>Imágenes:</h4>
            {product.images.map((img, index) => (
              <img
                key={img._id}
                src={img.data} // Usamos el campo 'data' que contiene la imagen en Base64
                alt={`Imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Variaciones */}
        {product.variation && product.variation.length > 0 && (
          <div>
            <h4>Variaciones:</h4>
            {product.variation.map((variant, index) => (
              <div key={index}>
                <p><strong>Color:</strong> {variant.color}</p>
                {variant.size && variant.size.length > 0 && (
                  <ul>
                    {variant.size.map((sizeItem, idx) => (
                      <li key={idx}>
                        Tamaño: {sizeItem.name}, Stock: {sizeItem.stock}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        <Button onClick={onClose}>Cerrar</Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductViewModal;