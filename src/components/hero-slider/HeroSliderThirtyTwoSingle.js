import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HeroSliderThirtyTwoSingle = ({ data }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Definir la imagen a usar según si es móvil o no
  let backgroundImage = process.env.PUBLIC_URL + data.image;
  if (isMobile) {
    if (data.id === 1) {
      backgroundImage = process.env.PUBLIC_URL + "/assets/img/slider/mobile_1.jpg";
    } else if (data.id === 2) {
      backgroundImage = process.env.PUBLIC_URL + "/assets/img/slider/mobile_2.jpg";
    }
  }

  return (
    <div
      className="single-slider-2 slider-height-2 d-flex align-items-center bg-img hero-slider-mobile"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-md-8 col-12">
            <div className="slider-content-blue slider-content-2 slider-content-2--white slider-animated-1">
              <h3
                className="animated no-style"
                dangerouslySetInnerHTML={{ __html: data.title }}
              />
              <div className="slider-btn-blue btn-hover">
                <Link
                  className="animated"
                  to={process.env.PUBLIC_URL + data.url}
                >
                  VER CATÁLOGO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroSliderThirtyTwoSingle.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string,
  })
};

export default HeroSliderThirtyTwoSingle;
