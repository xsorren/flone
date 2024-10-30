// src/components/productlist/ProductEditModal.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import axiosInstance from '../../utils/axiosInstance'; // Asegúrate de importar la instancia de Axios correctamente
import { toast } from 'react-toastify'; // Opcional: Para notificaciones

const ProductEditModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    code: product.code,
    batch: product.batch,
    name: product.name,
    stock: product.stock,
    purchaseCost: product.purchaseCost,
    totalPrice: product.totalPrice,
    price: product.price, // Asegúrate de incluir el precio
    discount: product.discount, // Y el descuento si aplica
    shortDescription: product.shortDescription,
    // Añade otros campos si es necesario
  });

  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState(product.images || []);
  const navigate = useNavigate(); // Importar useNavigate si lo usas

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Actualizar producto
      await axiosInstance.put(`/api/products/${product._id}`, formData);
      toast.success('Producto actualizado correctamente');

      // Subir imágenes
      if (images.length > 0) {
        const imageData = new FormData();
        images.forEach((image) => {
          imageData.append('images', image);
        });

        const res = await axiosInstance.post(`/api/products/${product._id}/images`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setCurrentImages(res.data.images);
        toast.success('Imágenes subidas correctamente');
      }

      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axiosInstance.delete(`/api/products/${product._id}`);
      toast.success('Producto eliminado correctamente');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar el producto');
    }
  };

  // Función para eliminar una imagen
  const handleDeleteImage = async (imgPath) => {
    try {
      await axiosInstance.delete(`/api/products/${product._id}/images`, {
        data: { imagePath: imgPath },
      });
      setCurrentImages(currentImages.filter((img) => img !== imgPath));
      toast.success('Imagen eliminada correctamente');
    } catch (err) {
      console.error(err);
      toast.error('Error al eliminar la imagen');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Editar Producto</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="code"
            placeholder="Código"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="batch"
            placeholder="Lote"
            value={formData.batch}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Artículo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />
          <input
            type="number"
            name="purchaseCost"
            placeholder="Costo Compra"
            value={formData.purchaseCost}
            onChange={handleChange}
          />
          <input
            type="number"
            name="totalPrice"
            placeholder="Precio Total"
            value={formData.totalPrice}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Precio de Venta"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            type="number"
            name="discount"
            placeholder="Descuento (%)"
            value={formData.discount}
            onChange={handleChange}
          />
          <textarea
            name="shortDescription"
            placeholder="Descripción Corta"
            value={formData.shortDescription}
            onChange={handleChange}
          ></textarea>
          {/* Añade más campos según sea necesario */}

          <div className="current-images">
            <h4>Imágenes Actuales:</h4>
            {currentImages.length > 0 ? (
              currentImages.map((img, index) => (
                <div key={index} className="image-item">
                  <img src={`http://localhost:5000${img}`} alt={`Imagen ${index + 1}`} width="100" />
                  <button type="button" onClick={() => handleDeleteImage(img)}>
                    Eliminar
                  </button>
                </div>
              ))
            ) : (
              <p>No hay imágenes actualmente.</p>
            )}
          </div>

          <div className="upload-images">
            <h4>Subir Nuevas Imágenes:</h4>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />
          </div>

          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={handleDeleteProduct}>
            Eliminar Producto
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
