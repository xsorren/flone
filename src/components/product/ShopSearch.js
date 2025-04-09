import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ShopSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Extraer el término de búsqueda de la URL al cargar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Construir los parámetros de búsqueda
    const params = new URLSearchParams(location.search);
    
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    
    // Actualizar la URL con los parámetros de búsqueda
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Buscar </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Escribe aquí..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSearch;
