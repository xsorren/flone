import { stringToArray } from "./stringToArray";


// get products
export const getProducts = (products, category, type, limit) => {
  // Actualmente devuelve todos los productos sin filtrar ni limitar.
  // Puedes agregar filtrados aquí si lo deseas, comprobando siempre
  // la existencia de los campos antes de usarlos.
  return products || [];
};

// get product discount price
export const getDiscountPrice = (price, discount) => {
  if (price == null || discount == null || discount <= 0) return null;
  return price - price * (discount / 100);
};

// get product cart quantity
// Si no existe variation, color, size, etc., se hace el matching básico por id.
// Si existe variation, se comprueba con cuidado. Si no hay coincidencia, se retorna 0.
export const getProductCartQuantity = (cartItems, product, color, size) => {
  if (!product?.id) return 0; 
  // Buscar el producto en el carrito coincidiendo con color/size si existen
  let productInCart = cartItems.find(single => {
    if (single.id !== product.id) return false;
    if (color && single.selectedProductColor && single.selectedProductColor !== color) return false;
    if (size && single.selectedProductSize && single.selectedProductSize !== size) return false;
    return true;
  });

  if (!productInCart) return 0;
  return productInCart.quantity || 0;
};

export const cartItemStock = (item, color, size) => {
  // Si no hay stock o variations, devolvemos un valor por defecto.
  if (typeof item.stock === "number") {
    return item.stock;
  }

  if (item.variation && Array.isArray(item.variation)) {
    const variationMatch = item.variation.find(v => v.color === color);
    if (variationMatch && Array.isArray(variationMatch.size)) {
      const sizeMatch = variationMatch.size.find(s => s.name === size);
      return sizeMatch?.stock ?? 0;
    }
  }
  return 0; // Si no hay nada, retorna 0
};

// get products based on category, tag, color, size, etc.
export const getSortedProducts = (products, sortType, sortValue) => {
  if (!Array.isArray(products)) return [];
  if (!sortType || !sortValue) return products;

  switch (sortType) {
    case "category":
      return products.filter(product => {
        const cat = product.category ?? [];
        return Array.isArray(cat) && cat.includes(sortValue);
      });

    case "tag":
      return products.filter(product => {
        const tags = product.tag ?? [];
        return Array.isArray(tags) && tags.includes(sortValue);
      });

    case "color":
      return products.filter(product => {
        const variations = product.variation ?? [];
        return variations.some(single => single.color === sortValue);
      });

    case "size":
      return products.filter(product => {
        const variations = product.variation ?? [];
        return variations.some(variation =>
          Array.isArray(variation.size) &&
          variation.size.some(singleSize => singleSize.name === sortValue)
        );
      });

    case "filterSort":
      let sortProducts = [...products];
      if (sortValue === "default") {
        return sortProducts;
      }
      if (sortValue === "priceHighToLow") {
        // Si no hay price, consideramos price=0
        return sortProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      }
      if (sortValue === "priceLowToHigh") {
        return sortProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      }
      if (sortValue === "topRated") {
        // Si no hay rating, consideramos rating=0
        return sortProducts.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      }
      return sortProducts;

    default:
      return products;
  }
};

// Función auxiliar para obtener array con valores únicos
const getIndividualItemArray = array => {
  if (!Array.isArray(array)) return [];
  return array.filter((v, i, self) => i === self.indexOf(v));
};

// get individual categories
export const getIndividualCategories = (products) => {
  if (!Array.isArray(products)) return [];
  let allCategories = [];

  products.forEach((product) => {
    // category es un string y lo convertimos en array
    const categoriesArray = stringToArray(product.category);
    allCategories = allCategories.concat(categoriesArray);
  });

  // Quitamos duplicados
  return [...new Set(allCategories)];
};



// get individual tags
export const getIndividualTags = (products) => {
  if (!Array.isArray(products)) return [];
  let allTags = [];

  products.forEach((product) => {
    // product.tag es un string
    const tagsArray = stringToArray(product.tag);
    allTags = allTags.concat(tagsArray);
  });

  // Quitamos duplicados
  return [...new Set(allTags)];
};


// get individual colors
export const getIndividualColors = (products) => {
  if (!Array.isArray(products)) return [];
  let allColors = [];

  products.forEach((product) => {
    // product.color es un string
    const colorsArray = stringToArray(product.color);
    allColors = allColors.concat(colorsArray);
  });

  // Quitamos duplicados
  return [...new Set(allColors)];
};


// get individual sizes
export const getProductsIndividualSizes = (products) => {
  if (!Array.isArray(products)) return [];
  let allSizes = [];

  products.forEach((product) => {
    // product.size es un string
    const sizesArray = stringToArray(product.size);
    allSizes = allSizes.concat(sizesArray);
  });

  // Quitamos duplicados
  return [...new Set(allSizes)];
};


// get product individual sizes
export const getIndividualSizes = product => {
  if (!product || !Array.isArray(product.variation)) return [];
  let productSizes = [];
  product.variation.forEach(singleVariation => {
    const sizes = singleVariation.size ?? [];
    sizes.forEach(s => {
      if (s.name) productSizes.push(s.name);
    });
  });
  return getIndividualItemArray(productSizes);
};

export const setActiveSort = e => {
  const filterButtons = document.querySelectorAll(
    ".sidebar-widget-list-left button, .sidebar-widget-tag button, .product-filter button"
  );
  filterButtons.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const setActiveLayout = e => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const toggleShopTopFilter = e => {
  const shopTopFilterWrapper = document.querySelector(
    "#product-filter-wrapper"
  );
  shopTopFilterWrapper.classList.toggle("active");
  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.height = null;
  } else {
    shopTopFilterWrapper.style.height =
      shopTopFilterWrapper.scrollHeight + "px";
  }
  e.currentTarget.classList.toggle("active");
};
