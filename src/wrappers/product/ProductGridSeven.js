import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingleSeven from "../../components/product/ProductGridSingleSeven";

const ProductGridSeven = ({
  spaceBottomClass,
  colorClass,
  category,
  type,
  limit
}) => {
  const { products } = useSelector((state) => state.product);
  const currency = {
    currencySymbol: "$",
    currencyName: "USD",
    currencyRate: 1
}
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  
  const prods = getProducts(products, category, type, limit);

  return (
    <Fragment>
      {prods?.map((product) => {
        return (
          <div className="col-xl-3 col-md-6 col-lg-4 col-sm-6" key={product.id}>
            <ProductGridSingleSeven
              spaceBottomClass={spaceBottomClass}
              colorClass={colorClass}
              product={product}
              currency={currency}
              cartItem={
                cartItems.find((cartItem) => cartItem.id === product.id)
              }
              wishlistItem={
                wishlistItems.find(
                  (wishlistItem) => wishlistItem.id === product.id
                )
              }
              
            />
          </div>
        );
      })}
    </Fragment>
  );
};

ProductGridSeven.propTypes = {
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  limit: PropTypes.number
};

export default ProductGridSeven;
