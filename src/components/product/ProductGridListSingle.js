// src/components/ProductGridListSingle.js
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
  height: 400px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

// Estilos para los botones (solo iconos sin fondo)
const IconButtons = styled.div`
  .product-action-2 {
    position: absolute;
    top: 50%;
    left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: auto;
    transform: translateY(-50%);
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
    background: transparent;
    z-index: 9;
  }

  &:hover .product-action-2 {
    visibility: visible;
    opacity: 1;
  }

  .product-action-2 a,
  .product-action-2 button {
    font-size: 24px; /* Aumenté el tamaño para hacer más visibles los iconos */
    line-height: 42px;
    display: inline-block;
    width: 42px;
    height: 42px;
    margin: 5px 0;
    transition: all 0.4s ease-in-out;
    transform: scale(0);
    text-align: center;
    border: none;
    background: transparent !important; /* Fuerza fondo transparente */
    padding: 0;
  }

  .product-action-2 a i,
  .product-action-2 button i {
    color: #000; /* Color negro para los iconos */
    transition: all 0.3s ease;
  }

  .product-action-2 a:hover i,
  .product-action-2 button:hover i,
  .product-action-2 a.active i,
  .product-action-2 button.active i {
    color: #bca487; /* Color marrón para hover/active */
  }

  &:hover .product-action-2 a,
  &:hover .product-action-2 button {
    transform: scale(1);
  }
`;

const ProductGridListSingle = ({
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
        <IconButtons className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            <ImageContainer>
              <img
                className="default-img"
                src={mainImage}
                alt={product.name}
              />
            </ImageContainer>
          </Link>

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
              <i className={wishlistItem !== undefined ? "fa fa-heart" : "fa fa-heart-o"} />
            </button>
          </div>
        </IconButtons>
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

ProductGridListSingle.propTypes = {
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

export default ProductGridListSingle;
