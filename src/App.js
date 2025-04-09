// src/App.js
import React, { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton";

// Importar los componentes nuevos
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/login/login";
import ProductList from "./components/productlist/ProductList";

// Home pages
const Home = lazy(() =>
  import("./pages/home/Home")
);

// Shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));

const Product = lazy(() => import("./pages/shop-product/Product"));
const ProductTabLeft = lazy(() =>
  import("./pages/shop-product/ProductTabLeft")
);
const ProductTabRight = lazy(() =>
  import("./pages/shop-product/ProductTabRight")
);
const ProductSticky = lazy(() => import("./pages/shop-product/ProductSticky"));
const ProductSlider = lazy(() => import("./pages/shop-product/ProductSlider"));
const ProductFixedImage = lazy(() =>
  import("./pages/shop-product/ProductFixedImage")
);

// Other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = () => {
  return (
    <Router>
      <ScrollToTop>
        <Suspense
          fallback={
            <div className="flone-preloader-wrapper">
              <div className="flone-preloader">
                <span></span>
                <span></span>
              </div>
            </div>
          }
        >
          <Routes>
            {/* Homepages */}
            <Route
              path={process.env.PUBLIC_URL + "/"}
              element={<Home />}
            />

            {/* Shop pages */}
            <Route
              path={process.env.PUBLIC_URL + "/shop-grid-standard"}
              element={<ShopGridStandard />}
            />


            {/* Product pages */}
            <Route
              path={process.env.PUBLIC_URL + "/product/:id"}
              element={<Product />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/product-tab-left/:id"}
              element={<ProductTabLeft />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/product-tab-right/:id"}
              element={<ProductTabRight />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/product-sticky/:id"}
              element={<ProductSticky />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/product-slider/:id"}
              element={<ProductSlider />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/product-fixed-image/:id"}
              element={<ProductFixedImage />}
            />

            {/* Other pages */}
            <Route
              path={process.env.PUBLIC_URL + "/about"}
              element={<About />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/contact"}
              element={<Contact />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/my-account"}
              element={<MyAccount />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/login-register"}
              element={<LoginRegister />}
            />

            <Route
              path={process.env.PUBLIC_URL + "/cart"}
              element={<Cart />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/wishlist"}
              element={<Wishlist />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/checkout"}
              element={<Checkout />}
            />

            {/* Nueva ruta para Login */}
            <Route
              path={process.env.PUBLIC_URL + "/login"}
              element={<Login />}
            />

            {/* Nueva ruta protegida para Listado de Productos */}
            <Route
              path={process.env.PUBLIC_URL + "/products"}
              element={
                <PrivateRoute>
                  <ProductList />
                </PrivateRoute>
              }
            />

            {/* Ruta por defecto para páginas no encontradas */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppButton />
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
