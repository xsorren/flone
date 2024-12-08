import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";

const ProductGridSingleFive = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch();

  return (
    <Fragment>
      <div className={clsx("product-wrap-3 scroll-zoom", spaceBottomClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            <img
              className="default-img"
              src={process.env.PUBLIC_URL + product.image[0]}
              alt=""
            />
          </Link>
          {product.discount || product.new ? (
            <div className="product-img-badges">
              {product.discount ? (
                <span className="pink">-{product.discount}%</span>
              ) : (
                ""
              )}
              {product.new ? <span className="purple">Nuevo</span> : ""}
            </div>
          ) : (
            ""
          )}

          <div className="product-content-3-wrap">
            <div className="product-content-3">
              <div className="product-title">
                <h3>
                  <Link
                    to={process.env.PUBLIC_URL + "/product/" + product.id}
                  >
                    {product.name}
                  </Link>
                </h3>
              </div>
              <div className="price-3">
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
              <div className="product-action-3">
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
                    <i className="fa fa-heart-o" />
                  </button>
                </div>
                <div className="pro-same-action pro-cart">
                  {product.affiliateLink ? (
                    <a
                      href={product.affiliateLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      title="Comprar ahora"
                    >
                      {" "}
                      <i className="fa fa-shopping-cart"></i>{" "}
                    </a>
                  ) : product.variation && product.variation.length >= 1 ? (
                    <Link
                      to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                      title="Ver opciones"
                    >
                      <i class="fa fa-cog"></i>
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
                      {" "}
                      <i className="fa fa-shopping-cart"></i>{" "}
                    </button>
                  ) : (
                    <button disabled className="active" title="Agotado">
                      <i className="fa fa-shopping-cart"></i>
                    </button>
                  )}
                </div>

                <div className="pro-same-action pro-quickview">
                  <button
                    onClick={() => setModalShow(true)}
                    title="Vista rápida"
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
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

ProductGridSingleFive.propTypes = {
  cartItem: PropTypes.shape({}),
  
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string
};

export default ProductGridSingleFive;
