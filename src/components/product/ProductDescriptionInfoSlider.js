import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { stringToArray } from "../../helpers/stringToArray"; // <--- Importa aquí
import { getProductCartQuantity } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";

const ProductDescriptionInfoSlider = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem
}) => {
  const dispatch = useDispatch();

  // Variation logic
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  // Parse category & tag to arrays
  const categoryArray = stringToArray(product.category);
  const tagArray = stringToArray(product.tag);

  return (
    <div className="product-details-content pro-details-slider-content">
      <h2>{product.name}</h2>

      <div className="product-details-price justify-content-center">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
            <span className="old">
              {currency.currencySymbol + finalProductPrice}
            </span>
          </Fragment>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice} </span>
        )}
      </div>

      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap justify-content-center">
          <div className="pro-details-rating mr-0">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : null}

      <div className="pro-details-list">
        <p>{product.short_description}</p>
      </div>

      {/* Variation logic if any */}
      {product.variation ? (
        <div className="pro-details-size-color justify-content-center">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                return (
                  <label
                    className={`pro-details-color-content--single ${single.color}`}
                    key={key}
                  >
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
          {/* Tamaño (descomentado si deseas mostrarlo) */}
          {/*
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation.map((single) =>
                single.color === selectedProductColor
                  ? single.size.map((singleSize, key) => (
                      <label
                        className={`pro-details-size-content--single`}
                        key={key}
                      >
                        <input
                          type="radio"
                          value={singleSize.name}
                          checked={
                            singleSize.name === selectedProductSize
                              ? "checked"
                              : ""
                          }
                          onChange={() => {
                            setSelectedProductSize(singleSize.name);
                            setProductStock(singleSize.stock);
                            setQuantityCount(1);
                          }}
                        />
                        <span className="size-name">{singleSize.name}</span>
                      </label>
                    ))
                  : null
              )}
            </div>
          </div>
          */}
        </div>
      ) : null}

      {/* Botones (comprar, carrito, wishlist) */}
      {product.affiliateLink ? (
        <div className="pro-details-quality justify-content-center">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Comprar ahora
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality justify-content-center">
          <div className="cart-plus-minus">
            <button
              onClick={() =>
                setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
              }
              className="dec qtybutton"
            >
              -
            </button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              onClick={() =>
                setQuantityCount(
                  quantityCount < productStock - productCartQty
                    ? quantityCount + 1
                    : quantityCount
                )
              }
              className="inc qtybutton"
            >
              +
            </button>
          </div>
          <div className="pro-details-cart btn-hover">
            {productStock && productStock > 0 ? (
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      ...product,
                      quantity: quantityCount,
                      selectedProductColor: selectedProductColor || null,
                      selectedProductSize: selectedProductSize || null
                    })
                  )
                }
                disabled={productCartQty >= productStock}
              >
                Añadir al carrito
              </button>
            ) : (
              <button disabled>Agotado</button>
            )}
          </div>
          <div className="pro-details-wishlist">
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
      )}

      {/* Categorías */}
      {categoryArray.length > 0 && (
        <div className="pro-details-meta justify-content-center">
          <span>Categorías:</span>
          <ul>
            {categoryArray.map((single, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                  {single}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Etiquetas */}
      {tagArray.length > 0 && (
        <div className="pro-details-meta justify-content-center">
          <span>Etiquetas:</span>
          <ul>
            {tagArray.map((single, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                  {single}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Redes sociales */}
      <div className="pro-details-social">
        <ul className="justify-content-center">
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-instagram" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProductDescriptionInfoSlider.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
    currencyRate: PropTypes.number
  }),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.shape({
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    variation: PropTypes.array,
    rating: PropTypes.number,
    affiliateLink: PropTypes.string,
    stock: PropTypes.number
  }),
  wishlistItem: PropTypes.shape({})
};

export default ProductDescriptionInfoSlider;
