import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const FooterOne = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu,
}) => {
  return (
    <footer
      className={`footer-area ${
        backgroundColorClass ? backgroundColorClass : ""
      } ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      } ${extraFooterClass ? extraFooterClass : ""} ${
        spaceLeftClass ? spaceLeftClass : ""
      } ${spaceRightClass ? spaceRightClass : ""}`}
      style={{
        padding: "20px",
        fontFamily: "inherit", // Asegurando que se utiliza la fuente de antes
      }}
    >
      <div className={containerClass ? containerClass : "container"}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ flex: "1 1 300px", margin: "15px" }}>
            <h3 style={{ fontFamily: "inherit" }}>SOBRE NOSOTROS</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link to={process.env.PUBLIC_URL + "#/"}>
                  Ubicación de la tienda
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/contact"}>Contacto</Link>
              </li>
            </ul>
          </div>
          <div style={{ flex: "1 1 300px", margin: "15px" }}>
            {/* Logo del footer */}
            <div>
              <img
                src="/assets/img/logo/logo.png"
                alt="Logo"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
          <div style={{ flex: "1 1 300px", margin: "15px" }}>
            <h3 style={{ fontFamily: "inherit" }}>SÍGUENOS</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <a
                  href="//www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="//www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="//www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterOne.propTypes = {
  backgroundColorClass: PropTypes.string,
  containerClass: PropTypes.string,
  extraFooterClass: PropTypes.string,
  sideMenu: PropTypes.bool,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default FooterOne;
