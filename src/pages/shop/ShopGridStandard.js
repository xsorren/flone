import { Fragment, useState, useEffect } from 'react';
import Paginator from 'react-hooks-paginator';
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getSortedProducts } from '../../helpers/product';
import SEO from "../../components/seo";
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import { supabase } from '../../utils/supabaseClient';
import { setProducts } from '../../store/slices/product-slice';

const ShopGridStandard = () => {
    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    
    const dispatch = useDispatch();
    // Usar productos para categorías, colores, etc.
    const { products } = useSelector((state) => state.product);

    const pageLimit = 15;
    let { pathname, search } = useLocation();
    const searchParams = new URLSearchParams(search);

    // Cargar todos los productos al inicio
    useEffect(() => {
        const loadAllProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        id, code, batch, name, stock, category, purchase_cost, 
                        total_price, price, discount, rating, short_description, 
                        affiliate_link, color, size, created_at, updated_at,
                        images (id, url)
                    `);
                
                if (error) {
                    console.error('Error al cargar productos:', error);
                    return;
                }
                
                // Actualizar Redux store
                dispatch(setProducts(data || []));
            } catch (error) {
                console.error('Error al cargar productos:', error);
            }
        };
        
        loadAllProducts();
    }, [dispatch]);

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
        
        // Actualizar URL con los parámetros
        const params = new URLSearchParams(search);
        if (sortValue) {
            params.set(sortType, sortValue);
        } else {
            params.delete(sortType);
        }
        
        // Actualizar URL sin recargar
        window.history.replaceState(
            {},
            '',
            `${pathname}?${params.toString()}`
        );
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
        
        // Actualizar URL con los parámetros
        const params = new URLSearchParams(search);
        if (sortValue) {
            params.set(sortType, sortValue);
        } else {
            params.delete(sortType);
        }
        
        // Actualizar URL sin recargar
        window.history.replaceState(
            {},
            '',
            `${pathname}?${params.toString()}`
        );
    }

    // Obtener productos filtrados de Supabase
    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            // Construir la consulta base
            let query = supabase
                .from('products')
                .select(`
                    id, code, batch, name, stock, category, purchase_cost, 
                    total_price, price, discount, rating, short_description, 
                    affiliate_link, color, size, created_at, updated_at,
                    images (id, url)
                `);
                
            // Aplicar filtros desde la URL
            const search = searchParams.get('search');
            const category = searchParams.get('category');
            const color = searchParams.get('color');
            const size = searchParams.get('size');
            
            // Filtro por búsqueda (nombre, código o descripción)
            if (search) {
                query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%,short_description.ilike.%${search}%`);
            }
            
            // Filtro por categoría
            if (category) {
                query = query.ilike('category', `%${category}%`);
            }
            
            // Filtro por color
            if (color) {
                query = query.ilike('color', `%${color}%`);
            }
            
            // Filtro por tamaño
            if (size) {
                query = query.ilike('size', `%${size}%`);
            }
            
            // Ordenamiento
            if (filterSortType === 'filterSort') {
                if (filterSortValue === 'priceHighToLow') {
                    query = query.order('price', { ascending: false });
                } else if (filterSortValue === 'priceLowToHigh') {
                    query = query.order('price', { ascending: true });
                } else if (filterSortValue === 'topRated') {
                    query = query.order('rating', { ascending: false });
                }
            }
            
            // Ejecutar consulta
            const { data, error } = await query;
            
            if (error) {
                console.error('Error al obtener productos:', error);
                return;
            }
            
            // Guardar todos los productos para la paginación
            setAllProducts(data || []);
            setSortedProducts(data || []);
            
            // Establecer datos actuales para mostrar según la paginación
            setCurrentData(data.slice(offset, offset + pageLimit) || []);
        } catch (error) {
            console.error('Error en la consulta:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar productos al iniciar y cuando cambien los filtros
    useEffect(() => {
        fetchFilteredProducts();
    }, [search, sortType, sortValue, filterSortType, filterSortValue]);

    // Actualizar datos al cambiar paginación
    useEffect(() => {
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, sortedProducts]);

    // Inicializar filtros desde URL al cargar
    useEffect(() => {
        const params = new URLSearchParams(search);
        
        // Establecer filtros iniciales desde URL
        if (params.get('category')) {
            setSortType('category');
            setSortValue(params.get('category'));
        }
        
        if (params.get('color')) {
            setSortType('color');
            setSortValue(params.get('color'));
        }
        
        if (params.get('size')) {
            setSortType('size');
            setSortValue(params.get('size'));
        }
        
        if (params.get('filterSort')) {
            setFilterSortType('filterSort');
            setFilterSortValue(params.get('filterSort'));
        }
    }, []);

    return (
        <Fragment>
            <SEO
                titleTemplate="Catálogo"
                description="Catálogo de productos"
            />

            <LayoutOne>
                {/* breadcrumb */}
                <Breadcrumb 
                    pages={[
                        {label: "Inicio", path: process.env.PUBLIC_URL + "/" },
                        {label: "Catálogo", path: process.env.PUBLIC_URL + pathname }
                    ]} 
                />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                {/* shop sidebar */}
                                <ShopSidebar products={products} getSortParams={getSortParams} sideSpaceClass="mr-30"/>
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                {/* shop topbar default */}
                                <ShopTopbar getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={sortedProducts.length} sortedProductCount={currentData.length} />

                                {/* shop page content default */}
                                {loading ? (
                                    <div className="d-flex justify-content-center my-5">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <ShopProducts layout={layout} products={currentData} />
                                )}

                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutOne>
        </Fragment>
    )
}

export default ShopGridStandard;
