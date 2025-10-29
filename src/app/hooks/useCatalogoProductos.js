import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/datos-internos';


export const useCatalogoProductos = (
  pagina, 
  tamanoPagina, 
  submittedSearchTerm, 
  rubroId, 
  lineaId, 
  familiaId, 
  conStock 
) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // Empezar en 1

  useEffect(() => {

    if(!rubroId && !lineaId && !familiaId){
      setProductos([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    const fetchCatalogo = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          pagina: pagina,
          tamanoPagina: tamanoPagina, 
        });


        if (submittedSearchTerm) {
          params.set('searchTerm', submittedSearchTerm);
        }
        if (rubroId) {
          params.set('rubroId', rubroId);
        }
        if (lineaId) {
          params.set('lineaId', lineaId);
        }
        if (familiaId) {
          params.set('familiaId', familiaId);
        }
        if (conStock) {
          params.set('conStock', 'true');
        }

  
        const response = await fetch(
          `${API_BASE_URL}/catalogo/productos?${params.toString()}`
        );

       if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json(); 

        console.log(`Catálogo recibido (Página ${pagina}):`, data);

        setProductos(data.productos || []); 
        setTotalPages(data.totalPaginas || 1); 
        
      } catch (err) {
        console.error('Error al cargar catálogo de productos:', err);
        setError(err.message);
        setProductos([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogo();
    

  }, [pagina, tamanoPagina, submittedSearchTerm, rubroId, lineaId, familiaId, conStock]); 
  
  return { productos, loading, error, totalPages };
};