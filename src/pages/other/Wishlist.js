import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart } from "../../store/slices/cart-slice";
import { deleteFromWishlist, deleteAllFromWishlist } from "../../store/slices/wishlist-slice"

const Wishlist = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  
  const currency = {
    currencySymbol: "$",
    currencyName: "USD",
    currencyRate: 1
  }
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);
  
  // Función para formatear precios con separadores de miles y sin centavos
  const formatPrice = (price) => {
    // Convertir a entero eliminando los decimales
    const priceInt = Math.floor(parseFloat(price));
    // Aplicar separador de miles
    return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Lista de deseos"
        description="Página de lista de deseos de la plantilla minimalista de comercio electrónico flone react."
      />
      <LayoutOne >
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Wishlist", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Tus artículos en la lista de deseos</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Nombre del producto</th>
                            <th>Precio unitario</th>
                            <th>Añadir al carrito</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems.map((wishlistItem, key) => {
                            const discountedPrice = getDiscountPrice(
                              wishlistItem.price,
                              wishlistItem.discount
                            );
                            const finalProductPrice = (
                              wishlistItem.price * currency.currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice = (
                              discountedPrice * currency.currencyRate
                            ).toFixed(2);
                            const cartItem = cartItems.find(
                              item => item.id === wishlistItem.id
                            );
                            const hasImages = wishlistItem.images && wishlistItem.images.length > 0;
                            const imageUrl = hasImages ? wishlistItem.images[0].url : "/assets/img/no-imagen.png";

                            console.log("Image URL:", process.env.PUBLIC_URL + imageUrl);

                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={process.env.PUBLIC_URL + imageUrl}
                                      alt={wishlistItem.name || "No disponible"}
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.id
                                    }
                                  >
                                    {wishlistItem.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol +
                                          formatPrice(parseFloat(finalProductPrice))}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol +
                                          formatPrice(parseFloat(finalDiscountedPrice))}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currency.currencySymbol +
                                        formatPrice(parseFloat(finalProductPrice))}
                                    </span>
                                  )}
                                </td>

                                <td className="product-wishlist-cart">
                                  {wishlistItem.affiliateLink ? (
                                    <a
                                      href={wishlistItem.affiliateLink}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {" "}
                                      Comprar ahora{" "}
                                    </a>
                                  ) : wishlistItem.variation &&
                                    wishlistItem.variation.length >= 1 ? (
                                    <Link
                                      to={`${process.env.PUBLIC_URL}/product/${wishlistItem.id}`}
                                    >
                                      Ver opciones
                                    </Link>
                                  ) : wishlistItem.stock &&
                                    wishlistItem.stock > 0 ? (
                                    <button
                                      onClick={() =>
                                        dispatch(addToCart(wishlistItem))
                                      }
                                      className={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0
                                          ? "active"
                                          : ""
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0
                                      }
                                      title={
                                        wishlistItem !== undefined
                                          ? "Añadido al carrito"
                                          : "Añadir al carrito"
                                      }
                                    >
                                      {cartItem !== undefined &&
                                      cartItem.quantity > 0
                                        ? "Añadido"
                                        : "Añadir al carrito"}
                                    </button>
                                  ) : (
                                    <button disabled className="active">
                                      Agotado
                                    </button>
                                  )}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      dispatch(deleteFromWishlist(wishlistItem.id))
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                        >
                          Continuar comprando
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => dispatch(deleteAllFromWishlist())}>
                          Vaciar lista de deseos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No se encontraron artículos en la lista de deseos <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Añadir artículos
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Wishlist;
