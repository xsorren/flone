import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const CtaTwo = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div
      className={clsx("cta-area bg-img", spaceTopClass, spaceBottomClass)}
      style={{
        backgroundImage: `url(${
          process.env.PUBLIC_URL + "/assets/img/bg/cta-bg.jpg"
        })`
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 ms-auto me-auto">
            <div className="cta-content text-center">
              <h2 className="title">
                Titulo <br /> Sub titulo
              </h2>
              <p className="text">
                Texto
              </p>
              <Link
                className="cta-btn"
                to={process.env.PUBLIC_URL + "/shop-grid-standard"}
              >
                COMPRAR AHORA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CtaTwo.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default CtaTwo;
