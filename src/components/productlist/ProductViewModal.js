import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  
  h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
`;

const Button = styled.button`
  padding: 10px 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  color: #fff;
  background-color: #1890ff;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #40a9ff;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const FieldLabel = styled.span`
  font-weight: 600;
  color: #555;
  display: inline-block;
  min-width: 150px;
`;

const FieldValue = styled.span`
  color: #333;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ImageItem = styled.div`
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.03);
    }
  }
`;

const SectionTitle = styled.h4`
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const ProductViewModal = ({ product, onClose }) => {
  // Si tuvieras otras relaciones (ej. product_categories, product_tags), las podrías mostrar.
  const categoryNames = product.product_categories
    ? product.product_categories.map((pc) => pc.category.name)
    : [];
  const tagNames = product.product_tags
    ? product.product_tags.map((pt) => pt.tag.name)
    : [];

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3>Detalles del Producto</h3>
        </ModalHeader>
        
        <ModalBody>
          <FieldGroup>
            <FieldLabel>Código:</FieldLabel>
            <FieldValue>{product.code}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Lote:</FieldLabel>
            <FieldValue>{product.batch}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Artículo:</FieldLabel>
            <FieldValue>{product.name}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Stock:</FieldLabel>
            <FieldValue>{product.stock}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Costo Compra:</FieldLabel>
            <FieldValue>${product.purchase_cost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Precio Total:</FieldLabel>
            <FieldValue>${product.total_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Precio de Venta:</FieldLabel>
            <FieldValue>${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Descuento:</FieldLabel>
            <FieldValue>{product.discount}%</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Categorías:</FieldLabel>
            <FieldValue>{categoryNames.join(', ') || 'Sin categorías'}</FieldValue>
          </FieldGroup>
          
          <FieldGroup>
            <FieldLabel>Etiquetas:</FieldLabel>
            <FieldValue>{tagNames.join(', ') || 'Sin etiquetas'}</FieldValue>
          </FieldGroup>
          
          {product.short_description && (
            <FieldGroup>
              <FieldLabel>Descripción:</FieldLabel>
              <FieldValue>{product.short_description}</FieldValue>
            </FieldGroup>
          )}
          
          {product.affiliate_link && (
            <FieldGroup>
              <FieldLabel>Enlace de Afiliado:</FieldLabel>
              <FieldValue>
                <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer">
                  {product.affiliate_link}
                </a>
              </FieldValue>
            </FieldGroup>
          )}

          {product.images && product.images.length > 0 && (
            <>
              <SectionTitle>Imágenes</SectionTitle>
              <ImageGrid>
                {product.images.map((img, index) => (
                  <ImageItem key={index}>
                    <img src={img.url} alt={`Producto ${index + 1}`} />
                  </ImageItem>
                ))}
              </ImageGrid>
            </>
          )}

          {product.variations && product.variations.length > 0 && (
            <>
              <SectionTitle>Variaciones</SectionTitle>
              {product.variations.map((variant, variantIndex) => (
                <div key={variantIndex} style={{ marginBottom: '16px' }}>
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
            </>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductViewModal;
