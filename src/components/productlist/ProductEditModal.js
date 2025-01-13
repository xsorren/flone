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
  &.delete {
    background-color: #ff4d4f;
    &:hover {
      background-color: #ff7875;
    }
  }
  &.cancel {
    background-color: #d9d9d9;
    color: #000;
    &:hover {
      background-color: #bfbfbf;
    }
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageItem = styled.div`
  position: relative;
`;

const DeleteImageButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 2px 5px;
  cursor: pointer;
  &:hover {
    background-color: #ff7875;
  }
`;

const ProductEditModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    code: product.code || '',
    batch: product.batch || '',
    name: product.name || '',
    stock: product.stock || 0,
    purchaseCost: product.purchase_cost || 0,
    totalPrice: product.total_price || 0,
    price: product.price || 0,
    discount: product.discount || 0,
    short_description: product.short_description || '',
    category: product.category || [],
    tag: product.tag || [],
    affiliateLink: product.affiliate_link || '',
  });

  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState(product.images || []);

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
    const { error: updateError } = await supabase
      .from('products')
      .update({
        code: formData.code,
        batch: formData.batch,
        name: formData.name,
        stock: Number(formData.stock),
        purchase_cost: Number(formData.purchaseCost),
        total_price: Number(formData.totalPrice),
        price: Number(formData.price),
        discount: Number(formData.discount),
        short_description: formData.short_description,
        affiliate_link: formData.affiliateLink
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(updateError);
      toast.error('Error al actualizar el producto');
      return;
    }

    // Subir nuevas imágenes (opcional, si quieres mantener esta lógica)
    // Si ya obtienes url publica directamente al subir a Supabase, puedes hacerlo aquí
    if (images.length > 0) {
      // Ejemplo simple, asumiendo que subes la imagen usando supabase.storage
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
    const imgToDelete = currentImages.find((img) => img.id === imgId);
    if (!imgToDelete) return;

    // Eliminar el registro de la imagen de la BD
    const { error: imageDeleteError } = await supabase.from('images').delete().eq('id', imgId);
    if (imageDeleteError) {
      console.error(imageDeleteError);
      toast.error('Error al eliminar la imagen');
      return;
    }

    setCurrentImages(currentImages.filter((img) => img.id !== imgId));
    toast.success('Imagen eliminada correctamente');
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Editar Producto</h3>
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
            name="short_description"
            placeholder="Descripción Corta"
            value={formData.short_description}
            onChange={handleChange}
          ></Textarea>
          <Input
            type="text"
            name="category"
            placeholder="Categorías (separadas por comas)"
            value={Array.isArray(formData.category) ? formData.category.join(', ') : formData.category}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="tag"
            placeholder="Etiquetas (separadas por comas)"
            value={Array.isArray(formData.tag) ? formData.tag.join(', ') : formData.tag}
            onChange={handleChange}
          />
          <Input
            type="text"
            name="affiliateLink"
            placeholder="Enlace de Afiliado"
            value={formData.affiliateLink}
            onChange={handleChange}
          />

          <div className="current-images">
            <h4>Imágenes Actuales:</h4>
            {currentImages.length > 0 ? (
              <ImageContainer>
                {currentImages.map((img) => (
                  <ImageItem key={img.id}>
                    <img
                      src={img.url}
                      alt="Imagen del producto"
                      style={{ maxHeight: '100px', maxWidth: '100px' }}
                    />
                    <DeleteImageButton
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      &times;
                    </DeleteImageButton>
                  </ImageItem>
                ))}
              </ImageContainer>
            ) : (
              <p>No hay imágenes actualmente.</p>
            )}
          </div>

          <div className="upload-images" style={{ marginTop: '10px' }}>
            <h4>Subir Nuevas Imágenes:</h4>
            <Input type="file" multiple accept="image/*" onChange={handleImagesChange} />
          </div>

          <div style={{ marginTop: '10px' }}>
            <Button type="submit">Guardar Cambios</Button>
            <Button type="button" className="delete" onClick={handleDeleteProduct}>
              Eliminar Producto
            </Button>
            <Button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProductEditModal;
