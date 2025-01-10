import React, { Fragment } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderThirtyTwo from "../../wrappers/hero-slider/HeroSliderThirtyTwo";
import TabProductNineteen from "../../wrappers/product/TabProductNineteen";
import BrandLogoSliderFour from "../../wrappers/brand-logo/BrandLogoSliderFour";
import CtaTwo from "../../wrappers/cta/CtaTwo";

const HomeConstructionMaterials = () => {
  return (
    <Fragment>
      <SEO
        titleTemplate="Corralón de Materiales"
        description="Tu tienda de confianza para materiales de construcción."
      />
      <LayoutOne
        headerContainerClass="container"
        headerPaddingClass="header-padding-1"
      >

        <HeroSliderThirtyTwo spaceBottomClass="pb-100" />

        <TabProductNineteen
          spaceTopClass="pt-95"
          spaceBottomClass="pb-100"
          category="furniture"
          productGridStyleClass="product-wrap-10--style2"
        />
        
        <CtaTwo spaceTopClass="pt-120" spaceBottomClass="pb-120" />
          
        <BrandLogoSliderFour spaceBottomClass="pb-50" spaceTopClass="pt-50" />
      
      </LayoutOne>
    </Fragment>
  );
};

export default HomeConstructionMaterials;
