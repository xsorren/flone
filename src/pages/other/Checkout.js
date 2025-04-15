import { Fragment, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import emailjs from '@emailjs/browser';
import { deleteAllFromCart } from "../../store/slices/cart-slice";

const Checkout = ({ isPresupuesto = false }) => {
  let cartTotalPrice = 0;
  const { pathname } = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useRef();

  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    notes: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  // Para este ejemplo, dejamos esta moneda fija en pesos
  const currency = {
    currencySymbol: "$",
    currencyName: "ARS",
    currencyRate: 1
  };

  // Función para formatear precios con separadores de miles y sin centavos
  const formatPrice = (price) => {
    // Convertir a entero eliminando los decimales
    const priceInt = Math.floor(parseFloat(price));
    // Aplicar separador de miles
    return priceInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!customerData.firstName || !customerData.lastName || !customerData.email || !customerData.phone) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor, completa los campos requeridos: nombre, apellido, email y teléfono'
      });
      return;
    }

    setStatus({
      submitting: true,
      success: false,
      error: false,
      message: ''
    });

    // Preparar el resumen del carrito para incluir en el email
    const cartSummary = cartItems.map(item => {
      const discountedPrice = getDiscountPrice(item.price, item.discount);
      const finalPrice = discountedPrice || item.price;
      
      return `${item.name} x ${item.quantity} - $${Math.floor(finalPrice * item.quantity)}`;
    }).join('\n');

    // Agrupar toda la información para EmailJS
    const templateParams = {
      customer_name: `${customerData.firstName} ${customerData.lastName}`,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      customer_address: `${customerData.address} ${customerData.address2 || ''}`,
      customer_location: `${customerData.city}, ${customerData.state} (${customerData.zip})`,
      customer_company: customerData.company || 'No especificada',
      order_items: cartSummary,
      order_total: `$${formatPrice(cartTotalPrice)}`,
      customer_notes: customerData.notes || 'Sin notas adicionales',
      order_type: isPresupuesto ? 'Solicitud de Presupuesto' : 'Pedido de Compra'
    };

    // Obtener las credenciales de EmailJS de las variables de entorno
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const userId = process.env.REACT_APP_EMAILJS_USER_ID;
    
    // Verificar que las variables de entorno existan
    if (!serviceId || !templateId || !userId) {
      console.error('Faltan credenciales de EmailJS en las variables de entorno');
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Error de configuración. Por favor, contacta al administrador.'
      });
      return;
    }

    // Enviar el email usando EmailJS
    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((result) => {
        console.log('Email enviado con éxito:', result.text);
        
        // Enviar evento a Google Analytics
        if (window.dataLayer) {
          window.dataLayer.push({
            'event': 'order_submitted',
            'order_value': cartTotalPrice,
            'currency': currency.currencyName
          });
        }
        
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: isPresupuesto 
            ? '¡Tu solicitud de presupuesto ha sido enviada! Te contactaremos pronto.' 
            : '¡Pedido realizado con éxito! Recibirás una confirmación por email.'
        });
        
        // Limpiar el carrito después de realizar el pedido
        dispatch(deleteAllFromCart());
        
        // Redirigir a la página de confirmación después de un breve retraso
        setTimeout(() => {
          navigate(process.env.PUBLIC_URL + "/order-success");
        }, 3000);
      })
      .catch((error) => {
        console.log('Error al enviar email:', error.text);
        
        setStatus({
          submitting: false,
          success: false,
          error: true,
          message: 'Ocurrió un error al procesar tu pedido. Por favor, intenta nuevamente.'
        });
      });
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
              <form ref={form} onSubmit={handleSubmit}>
                <div className="row">
                  {/* Columna Izquierda: Datos de facturación o datos del solicitante */}
                  <div className="col-lg-7">
                    <div className="billing-info-wrap">
                      <h3>{isPresupuesto ? "Datos del solicitante" : "Datos de facturación"}</h3>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Nombre *</label>
                            <input 
                              type="text" 
                              name="firstName"
                              value={customerData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Apellido *</label>
                            <input 
                              type="text" 
                              name="lastName"
                              value={customerData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Nombre de la empresa</label>
                            <input 
                              type="text" 
                              name="company"
                              value={customerData.company}
                              onChange={handleChange}
                            />
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
                              name="address"
                              value={customerData.address}
                              onChange={handleChange}
                            />
                            <input
                              placeholder="Piso, departamento, etc."
                              type="text"
                              name="address2"
                              value={customerData.address2}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Localidad / Ciudad</label>
                            <input 
                              type="text" 
                              name="city"
                              value={customerData.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Provincia</label>
                            <input 
                              type="text" 
                              name="state"
                              value={customerData.state}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Código Postal</label>
                            <input 
                              type="text" 
                              name="zip"
                              value={customerData.zip}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Teléfono *</label>
                            <input 
                              type="text" 
                              name="phone"
                              value={customerData.phone}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Correo electrónico *</label>
                            <input 
                              type="email" 
                              name="email"
                              value={customerData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="additional-info-wrap">
                        <h4>Información adicional</h4>
                        <div className="additional-info">
                          <label>Notas</label>
                          <textarea
                            placeholder="Notas sobre tu pedido o presupuesto, ej. requisitos especiales de entrega"
                            name="notes"
                            value={customerData.notes}
                            onChange={handleChange}
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
                                            formatPrice(finalDiscountedPrice * cartItem.quantity)
                                          : currency.currencySymbol +
                                            formatPrice(finalProductPrice * cartItem.quantity)}
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
                                    {currency.currencySymbol + formatPrice(cartTotalPrice)}
                                  </li>
                                </ul>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="payment-method"></div>
                      </div>

                      {status.error && (
                        <div className="form-message error-message mt-3" style={{
                          padding: "12px",
                          borderRadius: "4px",
                          marginTop: "15px",
                          backgroundColor: "rgba(255, 97, 97, 0.1)",
                          color: "#ff6161",
                          border: "1px solid #ff6161"
                        }}>
                          <p>{status.message}</p>
                        </div>
                      )}

                      {status.success && (
                        <div className="form-message success-message mt-3" style={{
                          padding: "12px",
                          borderRadius: "4px",
                          marginTop: "15px",
                          backgroundColor: "rgba(76, 175, 80, 0.1)",
                          color: "#4caf50",
                          border: "1px solid #4caf50"
                        }}>
                          <p>{status.message}</p>
                        </div>
                      )}

                      {!isPresupuesto ? (
                        <div className="place-order mt-25">
                          <button 
                            type="submit" 
                            className="btn-hover"
                            disabled={status.submitting}
                          >
                            {status.submitting ? 'Procesando...' : 'Realizar Pedido'}
                          </button>
                        </div>
                      ) : (
                        <div className="place-order mt-25">
                          <button 
                            type="submit" 
                            className="btn-hover"
                            disabled={status.submitting}
                          >
                            {status.submitting ? 'Procesando...' : 'Solicitar Presupuesto'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </form>
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
