import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from "./App";
import { store } from "./store/store";
import PersistProvider from "./store/providers/persist-provider";
import { setProducts } from "./store/slices/product-slice"
import { supabase } from './utils/supabaseClient'; // Importa el cliente Supabase
import 'animate.css';
import 'swiper/swiper-bundle.min.css';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "./assets/scss/style.scss";
import "./i18n";

const fetchProducts = async () => {
    const { data, error } = await supabase
    .from('products')
    .select(`
      id, code, batch, name, stock, category, purchase_cost, total_price, price, discount, rating, short_description, affiliate_link, created_at, updated_at,
      images (url)
    `);
  
  if (error) {
    console.error('Error fetching products with images:', error);
  } else {
    store.dispatch(setProducts(data));
  }
  
};

fetchProducts();

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <PersistProvider>
            <App />
        </PersistProvider>
    </Provider>
);
