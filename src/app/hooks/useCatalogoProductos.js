import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/datos-internos';

export const useCatalogoProductos = (pagina, tamanoPagina) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
    
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          pagina: pagina,
          tamañoPagina: tamanoPagina 
        });

        const response = await fetch(
          `${API_BASE_URL}/catalogo/productos?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();         
        console.log(`Catálogo recibido (Página ${pagina}):`, data);

        setProductos(data || []);
        
        
        if (data.length === 0 && pagina > 1) {

          setTotalPages(pagina - 1);
        } else if (data.length < tamanoPagina) {

          setTotalPages(pagina);
        } else if (data.length === tamanoPagina) {

          setTotalPages(pagina + 1); 
        } else {

          setTotalPages(0);
        }
        
      } catch (err) {
        console.error('Error al cargar catálogo de productos:', err);
        setError(err.message);
        setProductos([]);
        setTotalPages(0); 
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogo();

  }, [pagina, tamanoPagina]);
  
  return { productos, loading, error, totalPages };
};