import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from "swiper";
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../../components/swiper";

const ProductImageGallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [index, setIndex] = useState(-1);

  // Preparamos los slides para la vista Lightbox
  const slides =
    product?.images?.map((img, i) => ({
      src: process.env.PUBLIC_URL + img.url,
      key: i,
    })) || [];

  // Para evitar repeticiones cuando solo hay una imagen,
  // configuramos `loop` dinámicamente dependiendo de cuántas imágenes haya.
  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: product?.images?.length > 1,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: product?.images?.length > 1,
    slideToClickedSlide: true,
    navigation: true,
  };

  const hasDiscount = product.discount && product.discount > 0;
  const isNew = product.new;

  return (
    <Fragment>
      {/* Contenedor principal de imágenes */}
      <div className="product-large-image-wrapper">
        {(hasDiscount || isNew) && (
          <div className="product-img-badges">
            {hasDiscount ? (
              <span className="pink">-{product.discount}%</span>
            ) : null}
            {isNew ? <span className="purple">New</span> : null}
          </div>
        )}

        {product?.images?.length ? (
          // Si hay imágenes, mostramos el Swiper principal
          <Swiper options={gallerySwiperParams}>
            {product.images.map((single, key) => (
              <SwiperSlide key={key}>
                <button
                  className="lightgallery-button"
                  onClick={() => setIndex(key)}
                >
                  <i className="pe-7S-expand1" />
                </button>
                <div className="single-image">
                  <img
                    src={process.env.PUBLIC_URL + single.url}
                    className="img-fluid"
                    alt={product.name || "No disponible"}
                  />
                </div>
              </SwiperSlide>
            ))}
            {/* Lightbox para ver imágenes en grande */}
            <AnotherLightbox
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
              slides={slides}
              plugins={[Thumbnails, Zoom, Fullscreen]}
            />
          </Swiper>
        ) : (
          // Si NO hay imágenes, mostrar la imagen "no-imagen"
          <div className="single-image">
            <img
              src={process.env.PUBLIC_URL + "/assets/img/no-imagen.png"}
              className="img-fluid"
              alt={product.name || "No disponible"}
            />
          </div>
        )}
      </div>

      {/* Miniaturas debajo de la imagen principal (solo si hay imágenes) */}
      <div className="product-small-image-wrapper mt-15">
        {product?.images?.length ? (
          <Swiper options={thumbnailSwiperParams}>
            {product.images.map((single, key) => (
              <SwiperSlide key={key}>
                <div className="single-image">
                  <img
                    src={process.env.PUBLIC_URL + single.url}
                    className="img-fluid"
                    alt={product.name || "No disponible"}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>
    </Fragment>
  );
};

ProductImageGallery.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    images: PropTypes.array,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    shortDescription: PropTypes.string,
    discount: PropTypes.number,
    new: PropTypes.bool,
  }),
};

export default ProductImageGallery;
