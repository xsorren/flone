// src/components/ProductCreateModal.js
import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Styled Components
const ModalOverlay = styled.div`
  /* Estilos similares al modal de edición */
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
  /* Estilos similares al modal de edición */
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
`;

const Textarea = styled.textarea`
  margin-bottom: 10px;
  padding: 8px;
`;

const Button = styled.button`
  margin-right: 10px;
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: #1890ff;
  &:hover {
    background-color: #40a9ff;
  }
  &.cancel {
    background-color: #d9d9d9;
    color: #000;
    &:hover {
      background-color: #bfbfbf;
    }
  }
`;

const ProductCreateModal = ({ onClose, refreshProducts }) => {
  const [formData, setFormData] = useState({
    code: '',
    batch: '',
    name: '',
    stock: 0,
    purchaseCost: 0,
    totalPrice: 0,
    price: 0,
    discount: 0,
    shortDescription: '',
    category: [],
    tag: [],
    affiliateLink: '',
    // Añade otros campos si es necesario
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category' || name === 'tag') {
      setFormData({ ...formData, [name]: value.split(',').map((item) => item.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear producto
      const resProduct = await axiosInstance.post('/api/products', formData);
      const productId = resProduct.data.product._id;

      // Subir imágenes si las hay
      if (images.length > 0) {
        const imageData = new FormData();
        images.forEach((image) => {
          imageData.append('images', image);
        });

        await axiosInstance.post(`/api/products/${productId}/images`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      toast.success('Producto creado correctamente');
      onClose();
      refreshProducts(); // Refresca la lista de productos en el componente padre
    } catch (err) {
      console.error(err);
      toast.error('Error al crear el producto');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Crear Nuevo Producto</h3>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="code"
            placeholder="Código"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="batch"
            placeholder="Lote"
            value={formData.batch}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="name"
            placeholder="Artículo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="purchaseCost"
            placeholder="Costo Compra"
            value={formData.purchaseCost}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="totalPrice"
            placeholder="Precio Total"
            value={formData.totalPrice}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="price"
            placeholder="Precio de Venta"
            value={formData.price}
            onChange={handleChange}
          />
          <Input
            type="number"
            name="discount"
            placeholder="Descuento (%)"
            value={formData.discount}
            onChange={handleChange}
          />
          <Textarea
            name="shortDescription"
            placeholder="Descripción Corta"
            value={formData.shortDescription}
            onChange={handleChange}
          ></Textarea>
          <Input
            type="text"
            name="category"
            placeholder="Categorías (separadas por comas)"
            value={formData.category.join(', ')}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="tag"
            placeholder="Etiquetas (separadas por comas)"
            value={formData.tag.join(', ')}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="affiliateLink"
            placeholder="Enlace de Afiliado"
            value={formData.affiliateLink}
            onChange={handleChange}
          />
          {/* Añade más campos según sea necesario */}

          <div className="upload-images">
            <h4>Subir Imágenes:</h4>
            <Input type="file" multiple accept="image/*" onChange={handleImagesChange} />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Button type="submit">Crear Producto</Button>
            <Button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductCreateModal;
