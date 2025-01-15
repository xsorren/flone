import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProductGridTen from "./ProductGridTen";
import SectionTitleSeven from "../../components/section-title/SectionTitleSeven";

const TabProductNineteen = ({
  spaceTopClass,
  spaceBottomClass,
  category,
  productGridStyleClass
}) => {
  return (
    <div className={`product-area ${spaceTopClass} ${spaceBottomClass}`}>
      <div className="container">
        {/* Título de sección */}
        <SectionTitleSeven
          titleText="Catálogo de productos"
          positionClass="text-center"
          borderClass="bottom-border"
          spaceClass="mb-30"
        />
        {/* Se muestra por defecto el tipo "new" */}
        <div className="row">
          <ProductGridTen
            category={category}
            type="new"
            limit={6}
            spaceBottomClass="mb-25"
            productGridStyleClass={productGridStyleClass}
          />
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            className="loadMore6"
            to={process.env.PUBLIC_URL + "/shop-grid-standard"}
          >
            VER CATÁLOGO COMPLETO
          </Link>
        </div>
      </div>
    </div>
  );
};

TabProductNineteen.propTypes = {
  category: PropTypes.string,
  productGridStyleClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductNineteen;
