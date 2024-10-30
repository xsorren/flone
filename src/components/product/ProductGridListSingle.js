// src/components/ProductGridListSingle.js
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import "./ProductGridListSingle.css"; // Asegúrate de crear este archivo CSS

const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch();

  // Función para renderizar la imagen o el skeleton
  const renderProductImage = (isDefault = true) => {
    if (product && product.image && product.image.length > 0) {
      return (
        <img
          className={isDefault ? "default-img" : "hover-img"}
          src={process.env.PUBLIC_URL + product.image[0]}
          alt={product.name}
        />
      );
    } else {
      return <div className="image-skeleton"></div>;
    }
  };

  return (
    <Fragment>
      {/* Vista de Grid */}
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
            {renderProductImage(true)}
            {product.image && product.image.length > 1
              ? renderProductImage(false)
              : null}
          </Link>
          {(product.discount || product.new) && (
            <div className="product-img-badges">
              {product.discount && (
                <span className="pink">-{product.discount}%</span>
              )}
              {product.new && <span className="purple">New</span>}
            </div>
          )}

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={
                  wishlistItem !== undefined
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
          {product.rating && product.rating > 0 && (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          )}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span>
                  {currency.currencySymbol + finalDiscountedPrice}
                </span>{" "}
                <span className="old">
                  {currency.currencySymbol + finalProductPrice}
                </span>
              </Fragment>
            ) : (
              <span>{currency.currencySymbol + finalProductPrice} </span>
            )}
          </div>
        </div>
      </div>

      {/* Vista de Lista */}
      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <div className="product-img">
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                  {renderProductImage(true)}
                  {product.image && product.image.length > 1
                    ? renderProductImage(false)
                    : null}
                </Link>
                {(product.discount || product.new) && (
                  <div className="product-img-badges">
                    {product.discount && (
                      <span className="pink">-{product.discount}%</span>
                    )}
                    {product.new && <span className="purple">New</span>}
                  </div>
                )}
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
              <div className="product-list-price">
                {discountedPrice !== null ? (
                  <Fragment>
                    <span>
                      {currency.currencySymbol + finalDiscountedPrice}
                    </span>{" "}
                    <span className="old">
                      {currency.currencySymbol + finalProductPrice}
                    </span>
                  </Fragment>
                ) : (
                  <span>{currency.currencySymbol + finalProductPrice} </span>
                )}
              </div>
              {product.rating && product.rating > 0 && (
                <div className="rating-review">
                  <div className="product-list-rating">
                    <Rating ratingValue={product.rating} />
                  </div>
                </div>
              )}
              {product.shortDescription && <p>{product.shortDescription}</p>}

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
                        cartItem !== undefined && cartItem.quantity > 0
                          ? "active"
                          : ""
                      }
                      disabled={
                        cartItem !== undefined && cartItem.quantity > 0
                      }
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

                <div className="shop-list-wishlist ml-10">
                  <button
                    className={wishlistItem !== undefined ? "active" : ""}
                    disabled={wishlistItem !== undefined}
                    title={
                      wishlistItem !== undefined
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
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({})
};

export default ProductGridListSingle;
