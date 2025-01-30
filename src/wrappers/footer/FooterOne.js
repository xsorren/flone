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
  sideMenu
}) => {
  return (
    <>
      <footer
        className={`
          footer-area
          ${backgroundColorClass ? backgroundColorClass : ""}
          ${spaceTopClass ? spaceTopClass : ""}
          ${spaceBottomClass ? spaceBottomClass : ""}
          ${extraFooterClass ? extraFooterClass : ""}
          ${spaceLeftClass ? spaceLeftClass : ""}
          ${spaceRightClass ? spaceRightClass : ""}
        `}
        style={{
          padding: "20px",
          fontFamily: "inherit",
          fontSize: "1.05rem"
        }}
      >
        <div className={containerClass ? containerClass : "container"}>
          {/* Contenedor principal con clases para manejar la distribución */}
          <div className="footer-flex">
            {/* Columna 1: Sobre Nosotros */}
            <div className="footer-col-1">
              <h3 style={{ fontFamily: "inherit" }}>SOBRE NOSOTROS</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "7px" }}>
                  <Link to={process.env.PUBLIC_URL + "#/"}>
                    Ubicación
                  </Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/contact"}>Contacto</Link>
                </li>
              </ul>
            </div>

            {/* Columna 2: Logo */}
            <div className="footer-col-2">
              <img
                src="/assets/img/logo/logo.png"
                alt="Logo"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

            {/* Columna 3: Síguenos (con logos de redes sociales) */}
            <div className="footer-col-3">
              <h3 style={{ fontFamily: "inherit" }}>SÍGUENOS</h3>
              <ul className="social-icons">
                {/* <li>
                  <a
                    href="https://www.facebook.com/tuempresa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-facebook" style={{ fontSize: "24px" }} />
                  </a>
                </li> */}
                <li>
                  <a
                    href="https://www.instagram.com/donmauriciomateriales"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-instagram" style={{ fontSize: "24px" }} />
                  </a>
                </li>
                {/* <li>
                  <a
                    href="https://www.youtube.com/channel/tuempresa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fa fa-youtube" style={{ fontSize: "24px" }} />
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Bloque de estilos */}
      <style jsx>{`
        /* Contenedor principal en desktop: 3 columnas */
        .footer-flex {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .footer-col-1,
        .footer-col-2,
        .footer-col-3 {
          flex: 1 1 300px;
          margin: 15px;
        }

        /* Íconos de redes sociales en una sola fila */
        .social-icons {
          list-style: none;
          display: flex;
          justify-content: center;
          gap: 25px; /* Separación horizontal entre íconos */
          margin: 0;
          padding: 0;
        }

        /* 
          En pantallas pequeñas (< 768px):
          - Se oculta el encabezado "SOBRE NOSOTROS" en la columna 1.
          - El logo (col-2) ocupa 100% (fila separada).
          - "Sobre nosotros" y "Síguenos" se muestran en 2 columnas (50% cada uno).
        */
        @media (max-width: 767px) {
          .footer-col-1 h3 {
            display: none;
          }
          .footer-col-2 {
            flex: 0 0 100%;
            order: 1;
          }
          .footer-col-1 {
            flex: 0 0 50%;
            order: 2;
          }
          .footer-col-3 {
            flex: 0 0 50%;
            order: 3;
          }
        }
      `}</style>
    </>
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
  spaceRightClass: PropTypes.string
};

export default FooterOne;
