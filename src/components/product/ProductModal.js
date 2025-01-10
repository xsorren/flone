import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Swiper
import { EffectFade, Thumbs } from "swiper";
import Swiper, { SwiperSlide } from "../../components/swiper";

// Helpers
import { getDiscountPrice, getProductCartQuantity } from "../../helpers/product";
import { stringToArray } from "../../helpers/stringToArray";

// Redux actions
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";

// Rating component
import Rating from "./sub-components/ProductRating";

// Styled components para imagen
import styled from "styled-components";

export const ModalImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px; /* altura para la imagen grande */

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

export const ModalThumbnailContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100px; /* altura para la miniatura */

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

function ProductModal({ product, show, onHide, wishlistItem, currency }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // ============== VARIACIONES ==============
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

  // ============== CATEGORÍAS Y ETIQUETAS (STRING->ARRAY) ==============
  const categoryArray = stringToArray(product.category); 
  const tagArray = stringToArray(product.tag);

  // ============== PRECIOS ==============
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const currencySymbol = currency?.currencySymbol || "$";
  const currencyRate = currency?.currencyRate || 1;
  const finalProductPrice = (product.price || 0) * currencyRate;
  const finalDiscountedPrice = discountedPrice
    ? discountedPrice * currencyRate
    : null;

  // ============== SWIPER (IMÁGENES) ==============
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const hasImages = product.images && product.images.length > 0;
  const numImages = product.images?.length || 0;

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: numImages > 1, // solo activa loop si hay más de 1 imagen
    effect: numImages > 1 ? "fade" : undefined,
    fadeEffect: {
      crossFade: numImages > 1
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs]
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: numImages > 1,
    slideToClickedSlide: true,
    navigation: true
  };

  // Cerrar modal
  const onCloseModal = () => {
    setThumbsSwiper(null);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onCloseModal}
      className="product-quickview-modal-wrapper"
    >
      <Modal.Header closeButton />
      <div className="modal-body">
        <div className="row">
          {/* =======================
              Columna de imágenes
          ======================== */}
          <div className="col-md-5 col-sm-12">
            <div className="product-large-image-wrapper">
              {/* (opcional) BADGE: Descuento / Nuevo */}
              {(product.discount || product.new) && (
                <div className="product-img-badges">
                  {product.discount && (
                    <span className="pink">-{product.discount}%</span>
                  )}
                  {product.new && <span className="purple">New</span>}
                </div>
              )}

              <Swiper options={gallerySwiperParams}>
                {hasImages ? (
                  product.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <ModalImageContainer>
                        <img
                          src={img.url}
                          alt={product.name || "No disponible"}
                          className="img-fluid"
                        />
                      </ModalImageContainer>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <ModalImageContainer>
                      <img
                        src="/assets/img/no-imagen.png"
                        alt="No imagen"
                        className="img-fluid"
                      />
                    </ModalImageContainer>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
            {/* Thumbnails */}
            {hasImages && (
              <div className="product-small-image-wrapper mt-15">
                <Swiper options={thumbnailSwiperParams}>
                  {product.images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <ModalThumbnailContainer>
                        <img
                          src={img.url}
                          alt={`Thumbnail ${i}`}
                          className="img-fluid"
                        />
                      </ModalThumbnailContainer>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* =======================
              Columna de contenido
          ======================== */}
          <div className="col-md-7 col-sm-12">
            <div className="product-details-content quickview-content">
              {/* ======= Nombre del producto ======= */}
              <h2>{product.name}</h2>

              {/* ======= Precio (igual a ProductDescriptionInfo) ======= */}
              <div className="pro-details-price">
                {finalDiscountedPrice !== null ? (
                  <Fragment>
                    <span>
                      {currencySymbol}
                      {finalDiscountedPrice.toFixed(2)}
                    </span>{" "}
                    <span className="old">
                      {currencySymbol}
                      {finalProductPrice.toFixed(2)}
                    </span>
                  </Fragment>
                ) : (
                  <span>
                    {currencySymbol}
                    {finalProductPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* ======= Rating ======= */}
              {product.rating && product.rating > 0 && (
                <div className="pro-details-rating-wrap">
                  <div className="pro-details-rating">
                    <Rating ratingValue={product.rating} />
                  </div>
                </div>
              )}

              {/* ======= Descripción corta ======= */}
              {product.shortDescription && (
                <div className="pro-details-list">
                  <p>{product.shortDescription}</p>
                </div>
              )}

              {/* ======= Variaciones (color/talla) ======= */}
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

                  {/* Tallas (si existen) */}
                  {product.variation.some(
                    (v) => v.size && v.size.length > 0
                  ) && (
                    <div className="pro-details-size">
                      <span>Tamaño</span>
                      <div className="pro-details-size-content">
                        {product.variation.map((v) =>
                          v.color === selectedProductColor
                            ? v.size.map((s, idx) => (
                                <label
                                  className="pro-details-size-content--single"
                                  key={idx}
                                >
                                  <input
                                    type="radio"
                                    value={s.name}
                                    checked={s.name === selectedProductSize}
                                    onChange={() => {
                                      setSelectedProductSize(s.name);
                                      setProductStock(s.stock ?? 0);
                                      setQuantityCount(1);
                                    }}
                                  />
                                  <span className="size-name">{s.name}</span>
                                </label>
                              ))
                            : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======= Botones de comprar, carrito, wishlist ======= */}
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
                        setQuantityCount(
                          quantityCount > 1 ? quantityCount - 1 : 1
                        )
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

                  {/* Añadir al carrito */}
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
              )}

              {/* ======= Categorías ======= */}
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

              {/* ======= Etiquetas ======= */}
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

              {/* ======= Redes sociales ======= */}
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
          </div>
        </div>
      </div>
    </Modal>
  );
}

ProductModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string,
    currencyRate: PropTypes.number
  }),
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
    images: PropTypes.array,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    shortDescription: PropTypes.string,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    variation: PropTypes.array,
    discount: PropTypes.number,
    new: PropTypes.bool,
    rating: PropTypes.number,
    stock: PropTypes.number,
    affiliateLink: PropTypes.string
  })
};

export default ProductModal;
