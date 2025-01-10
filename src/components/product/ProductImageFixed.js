import PropTypes from "prop-types";

const ProductImageFixed = ({ product }) => {
  const hasDiscount = product.discount && product.discount > 0;
  const isNew = product.new;

  return (
    <div className="product-large-image-wrapper">
      {(hasDiscount || isNew) && (
        <div className="product-img-badges">
          {hasDiscount ? (
            <span className="pink">-{product.discount}%</span>
          ) : null}
          {isNew ? <span className="purple">New</span> : null}
        </div>
      )}

      <div className="product-fixed-image">
        {product.images && product.images.length > 0 ? (
          <img
            src={process.env.PUBLIC_URL + product.images[0].url}
            alt={product.name || "No disponible"}
            className="img-fluid"
          />
        ) : (
          <img
            src="/assets/img/no-imagen.png"
            alt="No disponible"
            className="img-fluid"
          />
        )}
      </div>
    </div>
  );
};

ProductImageFixed.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
};

export default ProductImageFixed;
