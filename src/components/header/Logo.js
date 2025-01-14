import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Logo = ({ imageUrl, logoClass }) => {
  // Estado para el ancho del logo. Por defecto, 220.
  const [logoWidth, setLogoWidth] = useState(220);

  useEffect(() => {
    const handleResize = () => {
      // Si la ventana es pequeña (por ejemplo, menos de 768px), el ancho del logo será 60.
      if (window.innerWidth < 768) {
        setLogoWidth(60);
      } else {
        setLogoWidth(220);
      }
    };

    // Ejecutar al montar para obtener el tamaño inicial.
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={clsx(logoClass)}>
      <Link to={process.env.PUBLIC_URL + "/"}>
        <img alt="" src={process.env.PUBLIC_URL + imageUrl} width={logoWidth} />
      </Link>
    </div>
  );
};

Logo.propTypes = {
  imageUrl: PropTypes.string,
  logoClass: PropTypes.string
};

export default Logo;
