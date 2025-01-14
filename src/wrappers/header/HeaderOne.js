import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import HeaderTop from "../../components/header/HeaderTop";

const HeaderOne = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);
  const [logoUrl, setLogoUrl] = useState("/assets/img/logo/logo-letras.png");
  // Nuevo estado para detectar si es pantalla pequeña
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    if (header) {
      setHeaderTop(header.offsetTop);
    }
    window.addEventListener("scroll", handleScroll);

    // Ejecutar la función de tamaño al montarse
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  // Actualiza el logo y el estado de pantalla pequeña
  const handleResize = () => {
    if (window.innerWidth < 992) {
      setLogoUrl("/assets/img/logo/logo-icon.png");
      setIsSmallScreen(true);
    } else {
      setLogoUrl("/assets/img/logo/logo-letras.png");
      setIsSmallScreen(false);
    }
  };

  return (
    <header className={clsx("header-area clearfix", headerBgClass, headerPositionClass)}>
      <div
        className={clsx(
          "header-top-area", 
          headerPaddingClass, 
          top === "visible" ? "d-none d-lg-block" : "d-none", 
          borderStyle === "fluid-border" && "border-none" 
        )}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          {/* header top */}
          <HeaderTop borderStyle={borderStyle} />
        </div>
      </div>

      <div
        className={clsx(
            // Si es pantalla pequeña, no se añade la clase de padding
            !isSmallScreen ? "header-res-padding" : "pt-2 pb-2", headerPaddingClass,
            "sticky-bar clearfix", 
            scroll > headerTop && "stick"
          )}
          >
          <div className={layout === "container-fluid" ? layout : "container"}>
            <div className={clsx("row",isSmallScreen && "align-items-center")}>
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              {/* header logo con imagen dinámica según el tamaño de la pantalla */}
              <Logo imageUrl={logoUrl} logoClass="logo" />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Icon group */}
              <IconGroup />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string,
  headerBgClass: PropTypes.string
};

export default HeaderOne;
