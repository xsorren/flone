import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { stringToArray } from "../../helpers/stringToArray"; // <--- Importa aquí
import { getProductCartQuantity } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";

const ProductDescriptionInfo = ({
  product,
  cartItems,
  wishlistItem,
  currency
}) => {
  const dispatch = useDispatch();

  const hasVariation =
    product.variation &&
    Array.isArray(product.variation) &&
    product.variation.length > 0;
  const defaultColor = hasVariation ? product.variation[0].color : null;
  const defaultSize = hasVariation ? product.variation[0].size[0]?.name : null;
  const defaultStock = hasVariation ? product.variation[0].size[0]?.stock : product.stock;

  const [selectedProductColor, setSelectedProductColor] = useState(defaultColor);
  const [selectedProductSize, setSelectedProductSize] = useState(defaultSize);
  const [productStock, setProductStock] = useState(defaultStock ?? 0);
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  // Manejo de currency (opcional)
  const currencySymbol = currency?.currencySymbol || "$";
  const currencyRate = currency?.currencyRate || 1;
  const finalProductPrice = (product.price || 0) * currencyRate;

  // Convierto las categorías y etiquetas a array si son strings
  const categoryArray = stringToArray(product.category); 
  const tagArray = stringToArray(product.tag);

  return (
    <div className="product-details-content ml-70">
      {/* Nombre del producto */}
      <h2>{product.name}</h2>

      {/* Precio del producto */}
      {product.price !== undefined && (
        <div className="pro-details-price">
          <span>
            {currencySymbol}
            {finalProductPrice.toFixed(2)}
          </span>
        </div>
      )}

      {/* Rating (si existe) */}
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : null}

      {/* Descripción corta */}
      {product.short_description && (
        <div className="pro-details-list">
          <p>{product.short_description}</p>
        </div>
      )}

      {/* Variaciones (color, tamaño) si existen */}
      {hasVariation && (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => (
                <label
                  className={`pro-details-color-content--single ${single.color}`}
                  key={key}
                >
                  <input
                    type="radio"
                    value={single.color}
                    name="product-color"
                    checked={single.color === selectedProductColor}
                    onChange={() => {
                      setSelectedProductColor(single.color);
                      if (single.size && single.size.length > 0) {
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock ?? 0);
                      } else {
                        setProductStock(product.stock ?? 0);
                      }
                      setQuantityCount(1);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>

          {/* Selección de Tamaño (si existe) */}
          {product.variation.some(v => v.size && v.size.length > 0) && (
            <div className="pro-details-size">
              <span>Tamaño</span>
              <div className="pro-details-size-content">
                {product.variation.map(single =>
                  single.color === selectedProductColor
                    ? single.size.map((singleSize, key) => (
                        <label
                          className="pro-details-size-content--single"
                          key={key}
                        >
                          <input
                            type="radio"
                            value={singleSize.name}
                            checked={singleSize.name === selectedProductSize}
                            onChange={() => {
                              setSelectedProductSize(singleSize.name);
                              setProductStock(singleSize.stock ?? 0);
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
          )}
        </div>
      )}

      {/* Botones de Comprar, Añadir al carrito y Wishlist */}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
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
        <div className="pro-details-quality">
          {/* Controles de cantidad */}
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
                  quantityCount < (productStock ?? 0) - productCartQty
                    ? quantityCount + 1
                    : quantityCount
                )
              }
              className="inc qtybutton"
            >
              +
            </button>
          </div>

          {/* Añadir al Carrito */}
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

          {/* Wishlist */}
          <div className="pro-details-wishlist">
            <button
              className={wishlistItem ? "active" : ""}
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

      {/* Categorías (texto convertido a array) */}
      {categoryArray.length > 0 && (
        <div className="pro-details-meta">
          <span>Categorías :</span>
          <ul>
            {categoryArray.map((cat, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Etiquetas (texto convertido a array) */}
      {tagArray.length > 0 && (
        <div className="pro-details-meta">
          <span>Etiquetas :</span>
          <ul>
            {tagArray.map((t, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Redes sociales */}
      <div className="pro-details-social">
        <ul>
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

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    short_description: PropTypes.string,
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array // si tienes legacy
    ]),
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    rating: PropTypes.number,
    variation: PropTypes.array,
    stock: PropTypes.number,
    affiliateLink: PropTypes.string
  }),
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
    currencyRate: PropTypes.number
  })
};

export default ProductDescriptionInfo;
