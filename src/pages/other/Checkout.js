import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const Checkout = ({ isPresupuesto = false }) => {
  let cartTotalPrice = 0;
  const { pathname } = useLocation();
  const { cartItems } = useSelector((state) => state.cart);

  // Para este ejemplo, dejamos esta moneda fija en pesos
  const currency = {
    currencySymbol: "$",
    currencyName: "ARS",
    currencyRate: 1
  };

  return (
    <Fragment>
      <SEO
        titleTemplate={isPresupuesto ? "Solicitud de Presupuesto" : "Checkout"}
        description="Página de Checkout / Presupuesto"
      />
      <LayoutOne>
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Inicio", path: process.env.PUBLIC_URL + "/" },
            {
              label: isPresupuesto ? "Presupuesto" : "Checkout",
              path: process.env.PUBLIC_URL + pathname
            }
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                {/* Columna Izquierda: Datos de facturación o datos del solicitante */}
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>{isPresupuesto ? "Datos del solicitante" : "Datos de facturación"}</h3>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Nombre</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Apellido</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Nombre de la empresa</label>
                          <input type="text" />
                        </div>
                      </div>
                      {/* Se elimina el campo País */}
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Dirección</label>
                          <input
                            className="billing-address"
                            placeholder="Calle, número, etc."
                            type="text"
                          />
                          <input
                            placeholder="Piso, departamento, etc."
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Localidad / Ciudad</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Provincia</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Código Postal</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Teléfono</label>
                          <input type="text" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Correo electrónico</label>
                          <input type="text" />
                        </div>
                      </div>
                    </div>

                    <div className="additional-info-wrap">
                      <h4>Información adicional</h4>
                      <div className="additional-info">
                        <label>Notas</label>
                        <textarea
                          placeholder="Notas sobre tu pedido o presupuesto, ej. requisitos especiales de entrega"
                          name="message"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Resumen del pedido o lista de productos */}
                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>{isPresupuesto ? "Productos seleccionados" : "Tu Pedido"}</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        {/* Encabezados */}
                        <div className="your-order-top">
                          <ul>
                            <li>Producto</li>
                            {/* Si es presupuesto, NO se muestra "Total" */}
                            {!isPresupuesto && <li>Total</li>}
                          </ul>
                        </div>

                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(
                                cartItem.price,
                                cartItem.discount
                              );
                              const finalProductPrice = (
                                cartItem.price * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = discountedPrice
                                ? (discountedPrice * currency.currencyRate).toFixed(2)
                                : null;

                              if (!isPresupuesto) {
                                // Sumar precios si es checkout normal
                                if (discountedPrice != null) {
                                  cartTotalPrice +=
                                    finalDiscountedPrice * cartItem.quantity;
                                } else {
                                  cartTotalPrice +=
                                    finalProductPrice * cartItem.quantity;
                                }
                              }

                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.name} X {cartItem.quantity}
                                  </span>
                                  {/* Si es presupuesto, no mostramos precios */}
                                  {!isPresupuesto && (
                                    <span className="order-price">
                                      {discountedPrice !== null
                                        ? currency.currencySymbol +
                                          (
                                            finalDiscountedPrice *
                                            cartItem.quantity
                                          ).toFixed(2)
                                        : currency.currencySymbol +
                                          (
                                            finalProductPrice *
                                            cartItem.quantity
                                          ).toFixed(2)}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {!isPresupuesto && (
                          <>
                            <div className="your-order-bottom">
                              <ul>
                                <li className="your-order-shipping">Envío</li>
                                <li>Envío gratis</li>
                              </ul>
                            </div>
                            <div className="your-order-total">
                              <ul>
                                <li className="order-total">Total</li>
                                <li>
                                  {currency.currencySymbol +
                                    cartTotalPrice.toFixed(2)}
                                </li>
                              </ul>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="payment-method"></div>
                    </div>

                    {!isPresupuesto ? (
                      <div className="place-order mt-25">
                        <button className="btn-hover">Realizar Pedido</button>
                      </div>
                    ) : (
                      <div className="place-order mt-25">
                        <button className="btn-hover">Solicitar Presupuesto</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No hay productos en el carrito <br />
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Ir al catálogo
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

export default Checkout;
