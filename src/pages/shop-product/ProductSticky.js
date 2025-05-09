import PropTypes from "prop-types";
import { Fragment } from "react"; 
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductImageDescriptionSticky from "../../wrappers/product/ProductImageDescriptionSticky";

const ProductSticky = () => {
  let { pathname } = useLocation();
  let { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const product = products.find(product => product.id === id);

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product page of flone react minimalist eCommerce template."
      />

      <LayoutOne >
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Inicio", path: process.env.PUBLIC_URL + "/" },
            {label: "Ver Producto", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />

        {/* product description with image */}
        <ProductImageDescriptionSticky
          spaceTopClass="mt-100"
          spaceBottomClass="mb-100"
          product={product}
        />


        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.category[0]}
        />
      </LayoutOne>
    </Fragment>
  );
};

ProductSticky.propTypes = {
  location: PropTypes.shape({})
};

export default ProductSticky;
