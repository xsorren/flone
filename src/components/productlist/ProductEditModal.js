import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { supabase } from '../../utils/supabaseClient';

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
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-height: 100px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
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
  
  &.delete {
    background-color: #ff4d4f;
    
    &:hover {
      background-color: #ff7875;
      box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
    }
  }
  
  &.cancel {
    background-color: #f5f5f5;
    color: #333;
    
    &:hover {
      background-color: #e8e8e8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const ImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 10px;
`;

const ImageItem = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 77, 79, 0.9);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ff4d4f;
    transform: scale(1.1);
  }
`;

const FileInput = styled.div`
  margin-top: 8px;
  
  input {
    padding: 8px 0;
  }
`;

const ProductEditModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    code: product.code || '',
    batch: product.batch || '',
    name: product.name || '',
    stock: product.stock || 0,
    purchaseCost: product.purchase_cost || 0.0,
    totalPrice: product.total_price || 0.0,
    price: product.price || 0.0,
    discount: product.discount || 0,
    short_description: product.short_description || '',
    category: product.category || [],
    affiliateLink: product.affiliate_link || '',
  });

  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState(product.images || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({ ...formData, [name]: value.split(',').map((item) => item.trim()) });
    } else if (['purchaseCost', 'totalPrice', 'price'].includes(name)) {
      // Asegurar que los valores monetarios se manejen como float
      setFormData({ ...formData, [name]: parseFloat(value) || 0.0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error: updateError } = await supabase
      .from('products')
      .update({
        code: formData.code,
        batch: formData.batch,
        name: formData.name,
        stock: Number(formData.stock),
        purchase_cost: parseFloat(formData.purchaseCost) || 0.0,
        total_price: parseFloat(formData.totalPrice) || 0.0,
        price: parseFloat(formData.price) || 0.0,
        discount: Number(formData.discount),
        short_description: formData.short_description,
        affiliate_link: formData.affiliateLink,
        category: formData.category.join(','),
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(updateError);
      toast.error('Error al actualizar el producto');
      return;
    }

    // Subir nuevas imágenes (opcional)
    if (images.length > 0) {
      for (const image of images) {
        const filePath = `products/${product.id}/${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image);

        if (uploadError) {
          console.error(uploadError);
          toast.error(`Error al subir la imagen ${image.name}`);
          continue;
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(filePath);

        // Insertar registro en la tabla images
        const { data: insertedImages, error: imageInsertError } = await supabase
          .from('images')
          .insert({
            product_id: product.id,
            url: publicUrl
          })
          .select();

        if (imageInsertError) {
          console.error(imageInsertError);
          toast.error('Error al guardar la imagen en la BD');
        } else {
          setCurrentImages([...currentImages, ...insertedImages]);
        }
      }
    }

    toast.success('Producto actualizado correctamente');
    onClose();
  };

  const handleDeleteProduct = async () => {
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) {
      console.error(deleteError);
      toast.error('Error al eliminar el producto');
      return;
    }
    
    toast.success('Producto eliminado correctamente');
    onClose();
  };

  const handleDeleteImage = async (imgId) => {
    // Primero eliminar de Supabase Storage (si es que tienes la ruta guardada)
    const imgToDelete = currentImages.find(img => img.id === imgId);
    if (!imgToDelete) return;
    
    // Eliminar de la BD
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imgId);
    
    if (deleteError) {
      console.error(deleteError);
      toast.error('Error al eliminar la imagen');
      return;
    }
    
    // Actualizar el state
    setCurrentImages(currentImages.filter(img => img.id !== imgId));
    toast.success('Imagen eliminada correctamente');
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3>Editar Producto</h3>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="code">Código</Label>
              <Input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="batch">Lote</Label>
              <Input
                type="text"
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="name">Nombre del Artículo</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormGroup>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="discount">Descuento (%)</Label>
                <Input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <FormGroup>
                <Label htmlFor="purchaseCost">Costo de Compra</Label>
                <Input
                  type="number"
                  id="purchaseCost"
                  name="purchaseCost"
                  step="0.01"
                  value={formData.purchaseCost}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="totalPrice">Precio Total</Label>
                <Input
                  type="number"
                  id="totalPrice"
                  name="totalPrice"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="price">Precio de Venta</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>
            
            <FormGroup>
              <Label htmlFor="category">Categorías (separadas por coma)</Label>
              <Input
                type="text"
                id="category"
                name="category"
                value={Array.isArray(formData.category) ? formData.category.join(', ') : formData.category}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="short_description">Descripción Corta</Label>
              <Textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="affiliateLink">Enlace de Afiliado</Label>
              <Input
                type="url"
                id="affiliateLink"
                name="affiliateLink"
                value={formData.affiliateLink}
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Imágenes Actuales</Label>
              {currentImages && currentImages.length > 0 ? (
                <ImageContainer>
                  {currentImages.map((img) => (
                    <ImageItem key={img.id}>
                      <img src={img.url} alt="Product" />
                      <DeleteImageButton onClick={() => handleDeleteImage(img.id)}>×</DeleteImageButton>
                    </ImageItem>
                  ))}
                </ImageContainer>
              ) : (
                <p>No hay imágenes para este producto</p>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="newImages">Subir Nuevas Imágenes</Label>
              <FileInput>
                <Input
                  type="file"
                  id="newImages"
                  multiple
                  onChange={handleImagesChange}
                />
              </FileInput>
            </FormGroup>
          </Form>
        </ModalBody>
        
        <ModalFooter>
          <Button type="button" className="delete" onClick={handleDeleteProduct}>
            Eliminar Producto
          </Button>
          
          <ButtonGroup>
            <Button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Guardar Cambios
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductEditModal;
