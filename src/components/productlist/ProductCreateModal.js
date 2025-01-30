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

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
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
        <h3>Crear Nuevo Producto</h3>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="code">Código:</Label>
          <Input
            id="code"
            type="text"
            name="code"
            placeholder="Código"
            value={formData.code}
            onChange={handleChange}
            required
          />

          <Label htmlFor="batch">Lote:</Label>
          <Input
            id="batch"
            type="text"
            name="batch"
            placeholder="Lote"
            value={formData.batch}
            onChange={handleChange}
          />

          <Label htmlFor="name">Artículo:</Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Artículo"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Label htmlFor="stock">Stock:</Label>
          <Input
            id="stock"
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <Label htmlFor="purchaseCost">Costo de Compra:</Label>
          <Input
            id="purchaseCost"
            type="number"
            name="purchaseCost"
            placeholder="Costo Compra"
            value={formData.purchaseCost}
            onChange={handleChange}
          />

          <Label htmlFor="totalPrice">Precio Total:</Label>
          <Input
            id="totalPrice"
            type="number"
            name="totalPrice"
            placeholder="Precio Total"
            value={formData.totalPrice}
            onChange={handleChange}
          />

          <Label htmlFor="price">Precio de Venta:</Label>
          <Input
            id="price"
            type="number"
            name="price"
            placeholder="Precio de Venta"
            value={formData.price}
            onChange={handleChange}
          />

          <Label htmlFor="discount">Descuento (%):</Label>
          <Input
            id="discount"
            type="number"
            name="discount"
            placeholder="Descuento (%)"
            value={formData.discount}
            onChange={handleChange}
          />

          <Label htmlFor="short_description">Descripción Corta:</Label>
          <Textarea
            id="short_description"
            name="short_description"
            placeholder="Descripción Corta"
            value={formData.short_description}
            onChange={handleChange}
          ></Textarea>

          <Label htmlFor="category">Categorías:</Label>
          <Input
            id="category"
            type="text"
            name="category"
            placeholder="Categorías (separadas por comas)"
            value={
              Array.isArray(formData.category)
                ? formData.category.join(', ')
                : formData.category
            }
            onChange={handleChange}
          />


          <Label htmlFor="affiliateLink">Enlace de Afiliado:</Label>
          <Input
            id="affiliateLink"
            type="text"
            name="affiliateLink"
            placeholder="Enlace de Afiliado"
            value={formData.affiliateLink}
            onChange={handleChange}
          />

          <div className="upload-images">
            <h4>Subir Imágenes:</h4>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />
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
