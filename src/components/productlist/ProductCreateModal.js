import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { supabase } from '../../utils/supabaseClient';
import { uploadToS3 } from '../../utils/s3Client';

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
  });

  const [images, setImages] = useState([]);
  const bucketName = process.env.REACT_APP_S3_BUCKET;

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
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert([{
        code: formData.code,
        batch: formData.batch,
        name: formData.name,
        stock: Number(formData.stock),
        purchase_cost: Number(formData.purchaseCost),
        total_price: Number(formData.totalPrice),
        price: Number(formData.price),
        discount: Number(formData.discount),
        short_description: formData.shortDescription,
        affiliate_link: formData.affiliateLink
      }])
      .select();

    if (productError) {
      console.error(productError);
      toast.error('Error al crear el producto');
      return;
    }

    const newProduct = productData[0];
    const productId = newProduct.id;

    for (const image of images) {
      const filePath = `products/${productId}/${image.name}`;
      try {
        await uploadToS3(bucketName, filePath, image);
        const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${filePath}`;
        const { error: imageInsertError } = await supabase.from('images').insert({
          product_id: productId,
          url: imageUrl
        });

        if (imageInsertError) {
          console.error(imageInsertError);
          toast.error('Error al guardar la imagen en la BD');
        }
      } catch (err) {
        console.error(err);
        toast.error(`Error al subir la imagen ${image.name}`);
      }
    }

    toast.success('Producto creado correctamente');
    onClose();
    refreshProducts();
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
