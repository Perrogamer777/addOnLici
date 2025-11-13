import { useState, useCallback } from 'react';
import { useClient } from './useClient';

const API_BASE_URL = 'http://localhost:8080/datos-internos';

export const useBusquedaGeneral = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const client = useClient();

  const buscarProductos = useCallback(async (termino) => {
    if (!termino || termino.trim().length < 2) {
      setProductos([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        termino: termino.trim()
      });

      const url = `${API_BASE_URL}/productos/buscar?${params.toString()}`;
      console.log("Buscando productos:", url);
      
      let response;
      
      try {
        
        const fetchResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        if (!fetchResponse.ok) {
          throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
        }

        response = await fetchResponse.json();
        
      } catch (fetchError) {
        console.log("Fetch falló, usando ZAF Client:", fetchError.message);

        if (!client) {
          throw new Error("ZAF Client no disponible y fetch directo falló");
        }
        
        response = await client.request({
          url: url,
          type: 'GET'
        });
      }

      if (!response || !Array.isArray(response)) {
        console.warn("Respuesta no válida:", response);
        setProductos([]);
        return;
      }
      

      const productosTransformados = response.map(producto => ({
        id: producto.id,
        nombreCobol: producto.nombreCobol,

        sku: producto.id,
        nombre: producto.nombreCobol,
        precio: 0, // Se obtendrá al seleccionar el producto
        precioUnitario: 0,
        stockTotal: 999, 
        marca: 'Por determinar',
        categoria: 'General'
      }));

      setProductos(productosTransformados);

    } catch (err) {
      console.error("Error en búsqueda:", err);
      
      let errorMessage = 'Error en la búsqueda';
      if (err.status === 0) {
        errorMessage = 'Error de conexión';
      } else if (err.status === 404) {
        errorMessage = 'error';
      } else if (err.status >= 500) {
        errorMessage = '';
      }
      
      setError(errorMessage);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, [client]);

  const limpiarResultados = useCallback(() => {
    setProductos([]);
    setError(null);
  }, []);

  return {
    productos,
    loading,
    error,
    buscarProductos,
    limpiarResultados
  };
};