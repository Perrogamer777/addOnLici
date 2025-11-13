import { useState, useCallback } from 'react';
import { useClient } from './useClient';

const API_BASE_URL = 'http://localhost:8080/datos-internos';

export const useSugerenciasBusqueda = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [loadingSugerencias, setLoadingSugerencias] = useState(false);
  const [errorSugerencias, setErrorSugerencias] = useState(null);
  const client = useClient();

  const buscarSugerencias = useCallback(async (termino) => {
    if (!termino || termino.trim().length < 2) {
      setSugerencias([]);
      return;
    }

    if (!client) {
      console.error("[useSugerenciasBusqueda] ZAF Client no está listo");
      return;
    }

    try {
      setLoadingSugerencias(true);
      setErrorSugerencias(null);

      const params = new URLSearchParams({
        descripcion: termino.trim()
      });

      const url = `${API_BASE_URL}/catalogo/sugerencia-directa?${params.toString()}`;
      console.log("[useSugerenciasBusqueda] Buscando sugerencias para:", termino);

      const productoSugerido = await client.request({
        url: url,
        type: 'GET',
        cors: true
      });

      if (productoSugerido && productoSugerido.id) {
        const productoTransformado = {
          id: productoSugerido.id,
          nombreCobol: productoSugerido.nombreCobol,
          precio: productoSugerido.precio || 0,
          precioUnitario: productoSugerido.precio || 0,
          stockTotal: productoSugerido.stockTotal || 0,
          marca: productoSugerido.marca,
          categoria: productoSugerido.categoria,
          sku: productoSugerido.id,
          nombre: productoSugerido.nombreCobol
        };

        setSugerencias([productoTransformado]);
        console.log("[useSugerenciasBusqueda] Sugerencia encontrada:", productoTransformado);
      } else {
        setSugerencias([]);
        console.log("[useSugerenciasBusqueda] No se encontraron sugerencias");
      }

    } catch (err) {
      console.error("[useSugerenciasBusqueda] Error al buscar sugerencias:", err);
      setErrorSugerencias(err.message);
      setSugerencias([]);
    } finally {
      setLoadingSugerencias(false);
    }
  }, [client]);

  const limpiarSugerencias = useCallback(() => {
    setSugerencias([]);
    setErrorSugerencias(null);
  }, []);

  return {
    sugerencias,
    loadingSugerencias,
    errorSugerencias,
    buscarSugerencias,
    limpiarSugerencias
  };
};