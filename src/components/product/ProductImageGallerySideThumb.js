import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { EffectFade, Thumbs } from 'swiper';
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../../components/swiper";

const ProductImageGalleryLeftThumb = ({ product, thumbPosition }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [index, setIndex] = useState(-1);

  const slides = product?.images?.map((img, i) => ({
    src: process.env.PUBLIC_URL + img.url,
    key: i,
  })) || [];

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    loop: true,
    slideToClickedSlide: true,
    direction: "vertical",
    breakpoints: {
      320: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      640: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      768: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      992: {
        slidesPerView: 4,
        direction: "horizontal"
      },
      1200: {
        slidesPerView: 4,
        direction: "vertical"
      }
    }
  };

  const hasDiscount = product.discount && product.discount > 0;
  const isNew = product.new;

  return (
    <Fragment>
      <div className="row row-5 test">
        <div
          className={clsx(thumbPosition === "left"
              ? "col-xl-10 order-1 order-xl-2"
              : "col-xl-10")}
        >
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
              <Swiper options={gallerySwiperParams}>
                {product.images.map((single, key) => (
                  <SwiperSlide key={key}>
                    <button className="lightgallery-button" onClick={() => setIndex(key)}>
                      <i className="pe-7s-expand1"></i>
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
                <AnotherLightbox
                  open={index >= 0}
                  index={index}
                  close={() => setIndex(-1)}
                  slides={slides}
                  plugins={[Thumbnails, Zoom, Fullscreen]}
                />
              </Swiper>
            ) : null}
          </div>
        </div>
        <div
          className={clsx(thumbPosition === "left"
              ? "col-xl-2 order-2 order-xl-1"
              : "col-xl-2")}
        >
          <div className="product-small-image-wrapper product-small-image-wrapper--side-thumb">
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
            ) : null }
          </div>
        </div>
      </div>
    </Fragment>
  );
};

ProductImageGalleryLeftThumb.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  thumbPosition: PropTypes.string
};

export default ProductImageGalleryLeftThumb;
