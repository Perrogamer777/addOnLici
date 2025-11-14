import { useState, useCallback, useRef } from 'react';
import { useClient } from './useClient';

const API_BASE_URL = 'http://localhost:8080/datos-internos';

export const useSugerenciasEnTiempoReal = () => {
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const client = useClient();
  const timeoutRef = useRef(null);

  const buscarSugerencias = useCallback(async (termino) => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!termino || termino.trim().length < 2) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    if (!client) {
      console.error("[useSugerenciasEnTiempoReal] ZAF Client no está listo");
      return;
    }

    // Debounce: esperar 300ms antes de buscar
    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams({
          termino: termino.trim()
        });

        // Usar el endpoint de búsqueda general que devuelve múltiples productos
        const url = `${API_BASE_URL}/catalogo/productos/buscar?${params.toString()}`;
        console.log("[useSugerenciasEnTiempoReal] Buscando sugerencias para:", termino);

        let response;
        
        // Intentar primero con fetch directo
        try {
          const fetchResponse = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          });

          if (!fetchResponse.ok) {
            throw new Error(`HTTP ${fetchResponse.status}`);
          }

          response = await fetchResponse.json();
        } catch (fetchError) {
          // Fallback a ZAF Client
          response = await client.request({
            url: url,
            type: 'GET',
            cors: true
          });
        }

        if (response && Array.isArray(response)) {
          // Limitar a las primeras 5 sugerencias para no saturar la UI
          const sugerenciasLimitadas = response.slice(0, 5).map(producto => ({
            id: producto.id,
            nombreCobol: producto.nombreCobol,
            texto: `${producto.id} - ${producto.nombreCobol}`
          }));

          setSugerencias(sugerenciasLimitadas);
          setMostrarSugerencias(sugerenciasLimitadas.length > 0);
        } else {
          setSugerencias([]);
          setMostrarSugerencias(false);
        }

      } catch (err) {
        console.error("[useSugerenciasEnTiempoReal] Error:", err);
        setSugerencias([]);
        setMostrarSugerencias(false);
      } finally {
        setLoading(false);
      }
    }, 300);

  }, [client]);

  const ocultarSugerencias = useCallback(() => {
    setMostrarSugerencias(false);
  }, []);

  const limpiarSugerencias = useCallback(() => {
    setSugerencias([]);
    setMostrarSugerencias(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    sugerencias,
    loading,
    mostrarSugerencias,
    buscarSugerencias,
    ocultarSugerencias,
    limpiarSugerencias
  };
};