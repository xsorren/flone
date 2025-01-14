// src/components/ProductGridListSingle.js
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import styled from "styled-components";

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px; /* Ajusta la altura según sea necesario */

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

const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  // Si utilizas currency:
  const currencySymbol = currency?.currencySymbol || "$";
  const currencyRate = currency?.currencyRate || 1;
  const finalProductPrice = (product.price || 0) * currencyRate;

  // Renderizar la imagen principal o la imagen de fallback
  const renderProductImage = (isDefault = true) => {
    const hasImages = product.images && product.images.length > 0;
    const imageUrl = hasImages
      ? product.images[0].url
      : "/assets/img/no-imagen.png";

    return (
      <ImageContainer>
        <img
          className={isDefault ? "default-img" : "hover-img"}
          src={process.env.PUBLIC_URL + imageUrl}
          alt={product.name || "No disponible"}
        />
      </ImageContainer>
    );
  };

  return (
    <Fragment>
      {/* -------- VISTA DE GRID -------- */}
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
            {renderProductImage(true)}
            {/* 
              Si quieres mostrar solo la primera imagen, 
              comenta la siguiente línea que llama a la imagen “hover-img”.
            */}
            {/* {product.images && product.images.length > 1
              ? renderProductImage(false)
              : null} */}
          </Link>

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem ? "active" : ""}
                disabled={!!wishlistItem}
                title={
                  wishlistItem
                    ? "Añadido a la lista de deseos"
                    : "Añadir a la lista de deseos"
                }
                onClick={() => dispatch(addToWishlist(product))}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a
                  href={product.affiliateLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Comprar ahora
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                  Ver opciones
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
                    cartItem !== undefined
                      ? "Añadido al carrito"
                      : "Añadir al carrito"
                  }
                >
                  <i className="pe-7s-cart"></i>{" "}
                  {cartItem !== undefined && cartItem.quantity > 0
                    ? "Añadido"
                    : "Añadir al carrito"}
                </button>
              ) : (
                <button disabled className="active">
                  Agotado
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Vista rápida">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>

        <div className="product-content text-center">
          <h3>
            <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>

          {/* Precio (Grid) */}
          {product.price !== undefined && (
            <div className="product-price">
              <span>
                {currencySymbol}
                {finalProductPrice.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* -------- VISTA DE LISTA -------- */}
      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <div className="product-img">
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                  {renderProductImage(true)}
                  {/* 
                    Comentar esta llamada para mostrar solo la primera imagen.
                  */}
                  {/* {product.images && product.images.length > 1
                    ? renderProductImage(false)
                    : null} */}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-sm-6">
            <div className="shop-list-content">
              <h3>
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                  {product.name}
                </Link>
              </h3>

              {/* Rating (List) */}
              {product.rating && product.rating > 0 && (
                <div className="rating-review">
                  <div className="product-list-rating">
                    <Rating ratingValue={product.rating} />
                  </div>
                </div>
              )}

              {/* Descripción corta */}
              {product.short_description && <p>{product.short_description}</p>}

              {/* Precio (List) */}
              {product.price !== undefined && (
                <div className="product-list-price mb-3">
                  <span className="new">
                    {currencySymbol}
                    {finalProductPrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Botones y acciones */}
              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  {product.affiliateLink ? (
                    <a
                      href={product.affiliateLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Comprar ahora
                    </a>
                  ) : product.variation && product.variation.length >= 1 ? (
                    <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                      Ver opciones
                    </Link>
                  ) : product.stock && product.stock > 0 ? (
                    <button
                      onClick={() => dispatch(addToCart(product))}
                      className={
                        cartItem && cartItem.quantity > 0 ? "active" : ""
                      }
                      disabled={cartItem && cartItem.quantity > 0}
                      title={
                        cartItem
                          ? "Añadido al carrito"
                          : "Añadir al carrito"
                      }
                    >
                      <i className="pe-7s-cart"></i>{" "}
                      {cartItem && cartItem.quantity > 0
                        ? "Añadido"
                        : "Añadir al carrito"}
                    </button>
                  ) : (
                    <button disabled className="active">
                      Agotado
                    </button>
                  )}
                </div>

                <div className="shop-list-wishlist ml-10">
                  <button
                    className={wishlistItem ? "active" : ""}
                    disabled={!!wishlistItem}
                    title={
                      wishlistItem
                        ? "Añadido a la lista de deseos"
                        : "Añadir a la lista de deseos"
                    }
                    onClick={() => dispatch(addToWishlist(product))}
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Producto */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        wishlistItem={wishlistItem}
      />
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({
    quantity: PropTypes.number
  }),
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
    currencyRate: PropTypes.number
  }),
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    short_description: PropTypes.string,
    images: PropTypes.array,
    rating: PropTypes.number,
    stock: PropTypes.number,
    affiliateLink: PropTypes.string,
    variation: PropTypes.array
  }),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({})
};

export default ProductGridListSingle;
