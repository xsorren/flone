import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import styled from "styled-components";

// Estilos para el contenedor de la imagen, aplicando zoom en hover
const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px; /* Aumentamos la altura a 400px */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1); /* Zoom suave */
  }
`;

const ProductGridSingleTen = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  spaceBottomClass,
  colorClass,
  productGridStyleClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  const hasImages = product.images && product.images.length > 0;
  const mainImage = hasImages ? product.images[0].url : "/assets/img/no-imagen.png";

  // Si utilizas currency:
  const currencySymbol = currency?.currencySymbol || "$";
  const currencyRate = currency?.currencyRate || 1;
  const finalProductPrice = (product.price || 0) * currencyRate;

  return (
    <Fragment>
      <div className={clsx("product-wrap-10", spaceBottomClass, colorClass, productGridStyleClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            <ImageContainer>
              <img
                className="default-img"
                src={mainImage}
                alt={product.name}
              />
            </ImageContainer>
          </Link>

          {/* Removemos el badge de descuento y "New" */}
          {/* Si se necesitara quitar el descuento pero mantener "New", podríamos conditionar, 
             pero el usuario ha pedido quitar el descuento. Asumimos quitar ambos badges. */}
          {/* <div className="product-img-badges">
            {product.new && <span>New</span>}
          </div> */}

          <div className="product-action-2">
            {product.affiliate_link ? (
              <a
                href={product.affiliate_link}
                rel="noopener noreferrer"
                target="_blank"
                title="Comprar ahora"
              >
                <i className="fa fa-shopping-cart"></i>
              </a>
            ) : product.variation && product.variation.length >= 1 ? (
              <Link
                to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                title="Ver opciones"
              >
                <i className="fa fa-cog"></i>
              </Link>
            ) : product.stock && product.stock > 0 ? (
              <button
                onClick={() => dispatch(addToCart(product))}
                className={
                  cartItem !== undefined && cartItem.quantity > 0
                    ? "active"
                    : ""
                }
                disabled={cartItem !== undefined && cartItem.quantity > 0}
                title={
                  cartItem !== undefined ? "Añadido al carrito" : "Añadir al carrito"
                }
              >
                <i className="fa fa-shopping-cart"></i>
              </button>
            ) : (
              <button disabled className="active" title="Agotado">
                <i className="fa fa-shopping-cart"></i>
              </button>
            )}

            <button onClick={() => setModalShow(true)} title="Vista rápida">
              <i className="fa fa-eye"></i>
            </button>
            <button
              className={wishlistItem !== undefined ? "active" : ""}
              disabled={wishlistItem !== undefined}
              title={
                wishlistItem !== undefined
                  ? "Añadido a favoritos"
                  : "Añadir a favoritos"
              }
              onClick={() => dispatch(addToWishlist(product))}
            >
              <i className="fa fa-heart-o" />
            </button>
          </div>
        </div>
        <div className="product-content-2">
          <div className="title-price-wrap-2">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {product.name}
              </Link>
            </h3>
            {/* Precio */}
            {product.price !== undefined && (
              <div className="product-price">
                <span>
                  {currencySymbol}
                  {new Intl.NumberFormat(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(finalProductPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        wishlistItem={wishlistItem}
      />
    </Fragment>
  );
};

ProductGridSingleTen.propTypes = {
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
    currencyRate: PropTypes.number
  }),
  cartItem: PropTypes.shape({}),
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
    images: PropTypes.array,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  productGridStyleClass: PropTypes.string,
  wishlistItem: PropTypes.shape({})
};

export default ProductGridSingleTen;
