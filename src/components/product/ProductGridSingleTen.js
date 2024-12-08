import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";

const ProductGridSingleTen = ({
  product,
  cartItem,
  wishlistItem,
  spaceBottomClass,
  colorClass,
  productGridStyleClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();

  const hasImages = product.images && product.images.length > 0;
  const mainImage = hasImages ? product.images[0].url : "/assets/img/no-imagen.png";
  const hoverImage = hasImages && product.images.length > 1 ? product.images[1].url : null;

  return (
    <Fragment>
      <div className={clsx("product-wrap-10", spaceBottomClass, colorClass, productGridStyleClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
            <img
              className="default-img"
              src={mainImage}
              alt=""
            />
            {hoverImage ? (
              <img
                className="hover-img"
                src={hoverImage}
                alt=""
              />
            ) : (
              ""
            )}
          </Link>

          {/* Badge si aplica */}
          {(product.discount || product.new) && (
            <div className="product-img-badges">
              {product.discount ? <span>-{product.discount}%</span> : ""}
              {product.new ? <span>New</span> : ""}
            </div>
          )}

          <div className="product-action-2">
            {product.affiliateLink ? (
              <a
                href={product.affiliateLink}
                rel="noopener noreferrer"
                target="_blank"
                title="Comprar ahora"
              >
                {" "}
                <i className="fa fa-shopping-cart"></i>{" "}
              </a>
            ) : product.variation && product.variation.length >= 1 ? (
              <Link
                to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                title="Ver opciones"
              >
                <i className="fa fa-cog"></i>
              </Link>
            ) : product.stock && product.stock > 0 ? (
              <button
                onClick={() => dispatch(addToCart(product))}
                className={
                  cartItem !== undefined && cartItem.quantity > 0
                    ? "active"
                    : ""
                }
                disabled={cartItem !== undefined && cartItem.quantity > 0}
                title={
                  cartItem !== undefined ? "Añadido al carrito" : "Añadir al carrito"
                }
              >
                {" "}
                <i className="fa fa-shopping-cart"></i>{" "}
              </button>
            ) : (
              <button disabled className="active" title="Agotado">
                <i className="fa fa-shopping-cart"></i>
              </button>
            )}

            <button onClick={() => setModalShow(true)} title="Vista rápida">
              <i className="fa fa-eye"></i>
            </button>
            <button
              className={wishlistItem !== undefined ? "active" : ""}
              disabled={wishlistItem !== undefined}
              title={
                wishlistItem !== undefined
                  ? "Añadido a favoritos"
                  : "Añadir a favoritos"
              }
              onClick={() => dispatch(addToWishlist(product))}
            >
              <i className="fa fa-heart-o" />
            </button>
          </div>
        </div>
        <div className="product-content-2">
          <div className="title-price-wrap-2">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {product.name}
              </Link>
            </h3>
            {/* Se elimina cualquier referencia a precio */}
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        wishlistItem={wishlistItem}
      />
    </Fragment>
  );
};

ProductGridSingleTen.propTypes = {
  cartItem: PropTypes.shape({}),
  product: PropTypes.shape({}),
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  wishlistItem: PropTypes.shape({})
};

export default ProductGridSingleTen;
