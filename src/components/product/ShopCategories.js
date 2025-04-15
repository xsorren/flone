import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ShopCategories = ({ categories, getSortParams }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategories = searchParams.getAll('category');
  
  // Esta variable determina si el botón "Todas las categorías" debe estar activo
  const allCategoriesActive = selectedCategories.length === 0;

  // Efecto para detectar cambios en la URL y activar "Todas las categorías" si no hay categorías seleccionadas
  useEffect(() => {
    if (selectedCategories.length === 0) {
      // Activar visualmente el botón "Todas las categorías"
      const allCategoriesBtn = document.querySelector('.sidebar-widget-list-left button:first-child');
      if (allCategoriesBtn) {
        allCategoriesBtn.classList.add('active');
      }
      
      // Desactivar todos los demás botones de categoría
      const categoryButtons = document.querySelectorAll('.sidebar-widget-list-left button:not(:first-child)');
      categoryButtons.forEach(btn => {
        btn.classList.remove('active');
      });
    }
  }, [selectedCategories]);

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    
    // Si es "Todas las categorías"
    if (category === "") {
      // Eliminar todas las categorías de la URL
      const params = new URLSearchParams(location.search);
      params.delete('category');
      
      // Actualizar URL
      navigate({
        pathname: location.pathname,
        search: params.toString()
      });
      
      // Actualizar UI
      document.querySelectorAll(".sidebar-widget-list-left button").forEach(btn => {
        btn.classList.remove("active");
      });
      e.currentTarget.classList.add("active");
      
      return;
    }
    
    // Caso de categoría específica
    const params = new URLSearchParams(location.search);
    const currentCategories = params.getAll('category');
    
    if (currentCategories.includes(category)) {
      // Eliminar categoría
      params.delete('category');
      currentCategories.filter(cat => cat !== category)
        .forEach(cat => params.append('category', cat));
      
      // Si no quedan categorías, activar "Todas las categorías"
      if (params.getAll('category').length === 0) {
        document.querySelector('.sidebar-widget-list-left button:first-child').classList.add('active');
      }
      
      e.currentTarget.classList.remove('active');
    } else {
      // Agregar categoría
      params.append('category', category);
      
      // Desactivar "Todas las categorías"
      document.querySelector('.sidebar-widget-list-left button:first-child').classList.remove('active');
      
      e.currentTarget.classList.add('active');
    }
    
    // Actualizar URL
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categorías </h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  className={allCategoriesActive ? "active" : ""}
                  onClick={(e) => handleCategoryClick(e, "")}
                >
                  <span className="checkmark" /> Todas las categorías
                </button>
              </div>
            </li>
            {categories.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      className={selectedCategories.includes(category) ? "active" : ""}
                      onClick={(e) => handleCategoryClick(e, category)}
                    >
                      {" "}
                      <span className="checkmark" /> {category}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No categories found"
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopCategories;
