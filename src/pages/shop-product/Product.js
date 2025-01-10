import React, { Fragment } from "react"; 
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";

const Product = () => {
  let { pathname } = useLocation();
  let { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const product = products.find(product => product.id == id);

  return (
    <Fragment>
      <SEO
        titleTemplate="Product Page"
        description="Product page description."
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
        {product && (
          <ProductImageDescription
            spaceTopClass="pt-100"
            spaceBottomClass="pb-100"
            product={product}
          />
        )}

        {/* related product slider */}
        {product && product.category && product.category.length > 0 && (
          <RelatedProductSlider
            spaceBottomClass="pb-95"
            category={product.category[0]}
          />
        )}
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
