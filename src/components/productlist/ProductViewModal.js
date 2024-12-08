import React from 'react';
import styled from 'styled-components';

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
  // Extraer categorías y tags en arrays simples de nombres
  const categoryNames = product.product_categories ? product.product_categories.map(pc => pc.category.name) : [];
  const tagNames = product.product_tags ? product.product_tags.map(pt => pt.tag.name) : [];

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Detalles del Producto</h3>
        <p><strong>Código:</strong> {product.code}</p>
        <p><strong>Lote:</strong> {product.batch}</p>
        <p><strong>Artículo:</strong> {product.name}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Costo Compra:</strong> {product.purchase_cost}</p>
        <p><strong>Precio Total:</strong> {product.total_price}</p>
        <p><strong>Precio de Venta:</strong> {product.price}</p>
        <p><strong>Descuento:</strong> {product.discount}%</p>
        <p><strong>Descripción Corta:</strong> {product.short_description}</p>
        <p><strong>Categorías:</strong> {categoryNames.join(', ')}</p>
        <p><strong>Etiquetas:</strong> {tagNames.join(', ')}</p>
        <p><strong>Enlace de Afiliado:</strong> <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer">{product.affiliate_link}</a></p>

        {/* Mostrar imágenes */}
        {product.images && product.images.length > 0 && (
          <div>
            <h4>Imágenes:</h4>
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.url} 
                alt={`Imagen ${index + 1}`}
                style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginBottom: '10px' }}
              />
            ))}
          </div>
        )}

        {/* Variaciones */}
        {product.variations && product.variations.length > 0 && (
          <div>
            <h4>Variaciones:</h4>
            {product.variations.map((variant, variantIndex) => (
              <div key={variantIndex} style={{ marginBottom: '10px' }}>
                <p><strong>Color:</strong> {variant.color}</p>
                {variant.variation_sizes && variant.variation_sizes.length > 0 && (
                  <ul>
                    {variant.variation_sizes.map((sizeItem, sizeIndex) => (
                      <li key={sizeIndex}>
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
