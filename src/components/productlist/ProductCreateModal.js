// ProductCreateModal.js
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
  justify-content: flex-end;
  gap: 10px;
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
  
  &.cancel {
    background-color: #f5f5f5;
    color: #333;
    
    &:hover {
      background-color: #e8e8e8;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

const FileInput = styled.div`
  margin-top: 8px;
  
  input {
    padding: 8px 0;
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
    short_description: '',
    category: [], // ingresadas separadas por comas
    affiliateLink: ''
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({
        ...formData,
        [name]: value.split(',').map((item) => item.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  // ==============================
  // Lógica para crear categorías
  // ==============================
  const insertCategories = async (productId, categories) => {
    for (const catName of categories) {
      if (catName === '') continue;

      let { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', catName)
        .single();

      // code PGRST116 => no rows returned
      if (catError && catError.code !== 'PGRST116') {
        console.error(catError);
        toast.error(`Error buscando la categoría ${catName}`);
        continue;
      }

      let categoryId;
      if (!catData) {
        // Crear la categoría
        const { data: newCatData, error: newCatError } = await supabase
          .from('categories')
          .insert({ name: catName })
          .select()
          .single();

        if (newCatError) {
          console.error(newCatError);
          toast.error(`Error creando la categoría ${catName}`);
          continue;
        }
        categoryId = newCatData.id;
      } else {
        categoryId = catData.id;
      }

      // Insertar relación en product_categories
      const { error: relError } = await supabase
        .from('product_categories')
        .insert({ product_id: productId, category_id: categoryId });

      if (relError) {
        console.error(relError);
        toast.error(`Error asignando categoría ${catName} al producto`);
      }
    }
  };

  // ==============================
  // Crear el producto + imágenes
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear producto
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            code: formData.code,
            batch: formData.batch,
            name: formData.name,
            stock: Number(formData.stock),
            purchase_cost: Number(formData.purchaseCost),
            total_price: Number(formData.totalPrice),
            price: Number(formData.price),
            discount: Number(formData.discount),
            short_description: formData.short_description,
            affiliate_link: formData.affiliateLink,
            category: formData.category.join(','), // Aplicar mismo cambio si es necesario
          },
        ])
        .select();

      if (productError) {
        console.error(productError);
        toast.error('Error al crear el producto');
        return;
      }

      const newProduct = productData[0];
      const productId = newProduct.id;

      // Insertar categorías
      if (formData.category && formData.category.length > 0) {
        await insertCategories(productId, formData.category);
      }

      // Subir imágenes si las hay
      if (images.length > 0) {
        for (const image of images) {
          const filePath = `products/${productId}/${image.name}`;
          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, image);

          if (uploadError) {
            console.error(uploadError);
            toast.error('Error al subir imagen: ' + image.name);
            continue;
          }

          // Obtener URL pública
          const {
            data: { publicUrl },
          } = supabase.storage.from('product-images').getPublicUrl(filePath);

          // Insertar registro en tabla images
          const { error: imageInsertError } = await supabase
            .from('images')
            .insert({
              product_id: productId,
              url: publicUrl,
            });

          if (imageInsertError) {
            console.error(imageInsertError);
            toast.error('Error al guardar imagen en la BD');
          }
        }
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
        <ModalHeader>
          <h3>Crear Nuevo Producto</h3>
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
                value={formData.category.join(', ')}
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
              <Label htmlFor="images">Imágenes del Producto</Label>
              <FileInput>
                <Input
                  type="file"
                  id="images"
                  multiple
                  onChange={handleImagesChange}
                />
              </FileInput>
            </FormGroup>
          </Form>
        </ModalBody>
        
        <ModalFooter>
          <Button className="cancel" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar Producto</Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductCreateModal;
