import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { addToCart, decreaseQuantity, deleteFromCart, deleteAllFromCart } from "../../store/slices/cart-slice";
import { cartItemStock } from "../../helpers/product";

const Cart = () => {
  let cartTotalPrice = 0;

  const [quantityCount] = useState(1);
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  
  const currency = {
    currencySymbol: "$",
    currencyName: "USD",
    currencyRate: 1
  }  
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <Fragment>
      <SEO
        titleTemplate="Carrito"
        description="Página del carrito de la plantilla minimalista de comercio electrónico flone react."
      />

      <LayoutOne >
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Inicio", path: process.env.PUBLIC_URL + "/" },
            {label: "Carrito", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Artículos en tu carrito</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Imagen</th>
                            <th>Nombre del Producto</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem, key) => {
                            const discountedPrice = getDiscountPrice(
                              cartItem.price,
                              cartItem.discount
                            );
                            const finalProductPrice = (
                              cartItem.price * currency.currencyRate
                            ).toFixed(2);
                            const finalDiscountedPrice = (
                              discountedPrice * currency.currencyRate
                            ).toFixed(2);

                            discountedPrice != null
                              ? (cartTotalPrice +=
                                  finalDiscountedPrice * cartItem.quantity)
                              : (cartTotalPrice +=
                                  finalProductPrice * cartItem.quantity);
                            
                            // Verificar la existencia de imágenes
                            const hasImages = Array.isArray(cartItem.images) && cartItem.images.length > 0;
                            const imageUrl = hasImages 
                              ? cartItem.images[0].url 
                              : "/assets/img/no-imagen.png";

                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        process.env.PUBLIC_URL +
                                        imageUrl
                                      }
                                      alt={cartItem.name || "Imagen del producto"}
                                    />
                                  </Link>
                                </td>

                                <td className="product-name">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.id
                                    }
                                  >
                                    {cartItem.name}
                                  </Link>
                                  {cartItem.selectedProductColor &&
                                  cartItem.selectedProductSize ? (
                                    <div className="cart-item-variation">
                                      <span>
                                        Color: {cartItem.selectedProductColor}
                                      </span>
                                      <span>
                                        Tamaño: {cartItem.selectedProductSize}
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </td>

                                <td className="product-price-cart">
                                  {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol +
                                          finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol +
                                          finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : (
                                    <span className="amount">
                                      {currency.currencySymbol +
                                        finalProductPrice}
                                    </span>
                                  )}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() =>
                                        dispatch(decreaseQuantity(cartItem))
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.quantity}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() =>
                                        dispatch(addToCart({
                                          ...cartItem,
                                          quantity: quantityCount
                                        }))
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity &&
                                        cartItem.quantity >=
                                          cartItemStock(
                                            cartItem,
                                            cartItem.selectedProductColor,
                                            cartItem.selectedProductSize
                                          )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {discountedPrice !== null
                                    ? currency.currencySymbol +
                                      (
                                        finalDiscountedPrice * cartItem.quantity
                                      ).toFixed(2)
                                    : currency.currencySymbol +
                                      (
                                        finalProductPrice * cartItem.quantity
                                      ).toFixed(2)}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      dispatch(deleteFromCart(cartItem.cartItemId))
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
                          Continuar Comprando
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => dispatch(deleteAllFromCart())}>
                          Vaciar Carrito de Compras
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-end">
                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Total del Carrito
                        </h4>
                      </div>
                      <h5>
                        Total de productos{" "}
                        <span>
                          {currency.currencySymbol + cartTotalPrice.toFixed(2)}
                        </span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Gran Total{" "}
                        <span>
                          {currency.currencySymbol + cartTotalPrice.toFixed(2)}
                        </span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                      Realizar Pedido
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No se encontraron artículos en el carrito <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Comprar Ahora
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

export default Cart;
