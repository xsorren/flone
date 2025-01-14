import PropTypes from "prop-types";
import clsx from "clsx";
import { useEffect, useState } from "react";

const BrandLogoOneSingle = ({ data, spaceBottomClass }) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    // Se ejecuta una vez al montar para tener el valor inicial
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Si la pantalla es pequeña, reducimos la altura y agregamos márgenes laterales.
  const isMobile = windowWidth < 768;
  const imageStyle = {
    maxHeight: isMobile ? "80px" : "130px",
    marginLeft: isMobile ? "10px" : "0",
    marginRight: isMobile ? "10px" : "0",
    width: "auto",
    display: "inline-block"
  };

  return (
    <div className={clsx("single-brand-logo", spaceBottomClass)}>
      <img 
        src={process.env.PUBLIC_URL + data.image} 
        alt="" 
        style={imageStyle}
      />
    </div>
  );
};

BrandLogoOneSingle.propTypes = {
  data: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string
};

export default BrandLogoOneSingle;
