// ProductGridSingle.jsx
import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Rating from "./sub-components/ProductRating";
import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import styled from "styled-components";

const ProductImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px; /* Ajusta la altura según lo que desees */
  
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
const ProductGridSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);

  // Calcula el precio con descuento
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = discountedPrice
    ? +(discountedPrice * currency.currencyRate).toFixed(2)
    : null;

  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            <ProductImageContainer>
              {/* Imagen principal */}
              {product.images && product.images.length > 0 ? (
                <img
                  className="default-img"
                  src={
                    process.env.PUBLIC_URL +
                    (product.images[0].url || "/assets/img/no-imagen.png")
                  }
                  alt={product.name || ""}
                />
              ) : (
                <img
                  className="default-img"
                  src={process.env.PUBLIC_URL + "/assets/img/no-imagen.png"}
                  alt={product.name || ""}
                />
              )}
            </ProductImageContainer>

            {/* Hover image */}
            {product.images && product.images.length > 1 && (
              <ProductImageContainer>
                <img
                  className="hover-img"
                  src={process.env.PUBLIC_URL + product.images[1].url}
                  alt={product.name || ""}
                />
              </ProductImageContainer>
            )}
          </Link>
          {/* badgets: descuento, nuevo, etc. */}
          {(product.discount || product.new) && (
            <div className="product-img-badges">
              {product.discount && <span className="pink">-{product.discount}%</span>}
              {product.new && <span className="purple">New</span>}
            </div>
          )}

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
                  className={cartItem && cartItem.quantity > 0 ? "active" : ""}
                  disabled={cartItem && cartItem.quantity > 0}
                  title={
                    cartItem ? "Añadido al carrito" : "Añadir al carrito"
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
            <div className="pro-same-action pro-quickview">
              <button title="Vista rápida" onClick={() => setModalShow(true)}>
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          <h3>
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              {product.name}
            </Link>
          </h3>
          {product.rating && product.rating > 0 ? (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          ) : null}
          <div className="product-price">
            {finalDiscountedPrice !== null ? (
              <>
                <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
                <span className="old">
                  {currency.currencySymbol + finalProductPrice}
                </span>
              </>
            ) : (
              <span>{currency.currencySymbol + finalProductPrice}</span>
            )}
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
      />
    </Fragment>
  );
};

ProductGridSingle.propTypes = {
  cartItem: PropTypes.object,
  wishlistItem: PropTypes.object,
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
    currencyRate: PropTypes.number
  }),
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    images: PropTypes.array, // array de objetos con url
    discount: PropTypes.number,
    new: PropTypes.bool,
    rating: PropTypes.number,
    stock: PropTypes.number
  }),
  spaceBottomClass: PropTypes.string
};

export default ProductGridSingle;
