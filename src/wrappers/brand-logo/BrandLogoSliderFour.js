import PropTypes from "prop-types";
import clsx from "clsx";
import Swiper, { SwiperSlide } from "../../components/swiper";
import BrandLogoOneSingle from "../../components/brand-logo/BrandLogoOneSingle";
import brandLogoData from "../../data/brand-logos/brand-logo-one.json";

// Se ajustan los breakpoints para incluir espacio entre slides
const settings = {
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false
  },
  grabCursor: true,
  breakpoints: {
    320: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    480: {
      slidesPerView: 3,
      spaceBetween: 15
    },
    640: {
      slidesPerView: 4,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 5,
      spaceBetween: 20
    },
    1024: {
      slidesPerView: 6,
      spaceBetween: 30
    }
  }
};

const BrandLogoSliderFour = ({ spaceBottomClass, spaceTopClass, noBorder }) => {
  return (
    <div
      className={clsx(
        "brand-logo-area",
        noBorder ? "" : "border-top border-bottom",
        spaceBottomClass,
        spaceTopClass
      )}
    >
      <div className="container-fluid">
        <div className="brand-logo-active">
          {brandLogoData && (
            <Swiper options={settings}>
              {brandLogoData.map((single, key) => (
                <SwiperSlide key={key}>
                  <BrandLogoOneSingle data={single} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

BrandLogoSliderFour.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default BrandLogoSliderFour;
