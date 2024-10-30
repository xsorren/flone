import PropTypes from "prop-types";
import clsx from "clsx"
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import ProductGridTen from "./ProductGridTen";
import SectionTitleSeven from "../../components/section-title/SectionTitleSeven";

const TabProductNineteen = ({
  spaceTopClass,
  spaceBottomClass,
  category,
  productTabClass,
  productGridStyleClass
}) => {
  return (
    <div className={clsx("product-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        {/* section title */}
        <SectionTitleSeven
          titleText="Catálogo de productos"
          positionClass="text-center"
          borderClass="bottom-border"
          spaceClass="mb-30"
        />
        <Tab.Container defaultActiveKey="bestSeller">
          <Nav
            variant="pills"
            className={clsx("product-tab-list-6 justify-content-center mb-60", productTabClass)}
          >
            <Nav.Item>
              <Nav.Link eventKey="newArrival">
                <h4>Nuevos ingresos</h4>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="bestSeller">
                <h4>Mas vendidos</h4>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="newArrival">
              <div className="row">
                <ProductGridTen
                  category={category}
                  type="new"
                  limit={6}
                  spaceBottomClass="mb-25"
                  productGridStyleClass={productGridStyleClass}
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="bestSeller">
              <div className="row">
                <ProductGridTen
                  category={category}
                  type="bestSeller"
                  limit={6}
                  spaceBottomClass="mb-25"
                  productGridStyleClass={productGridStyleClass}
                />
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="saleItems">
              <div className="row">
                <ProductGridTen
                  category={category}
                  type="saleItems"
                  limit={6}
                  spaceBottomClass="mb-25"
                  productGridStyleClass={productGridStyleClass}
                />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
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
  productTabClass: PropTypes.string,
  productGridStyleClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default TabProductNineteen;
