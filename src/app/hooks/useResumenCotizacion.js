import { useState, useEffect, useCallback, useRef } from 'react';
import { useClient } from './useClient'; //

const API_BASE_URL = 'http://localhost:8080/datos-internos';

export const useResumenCotizacion = (idLicitacion) => {
  const client = useClient();

  // Estado de los items
  const [items, setItems] = useState([]);
  
  // Estados de la API
  const [isLoading, setIsLoading] = useState(true); // Cargando el resumen inicial
  const [isSaving, setIsSaving] = useState(false);  // Guardando el resumen
  const [error, setError] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const lastSavedHashRef = useRef(null);

  // get para cargar los datos de cotización guardados
  useEffect(() => {
    // Solo se ejecuta si tenemos el client de ZAF y el ID de la licitación
    if (!client || !idLicitacion) return;

    const cargarResumenGuardado = async () => {
      console.log(`[Hook] Cargando resumen guardado para ${idLicitacion}...`);
      setIsLoading(true);
      setError(null);
      const controller = new AbortController();
      
      try {
        const response = await client.request({
          url: `${API_BASE_URL}/licitacion/${idLicitacion}/resumen`,
          type: 'GET',
          cors: true,
          contentType: 'application/json'
        });
        
        if (response && response.itemsJson) {
          let itemsGuardados = [];
          try {
            const parsed = JSON.parse(response.itemsJson);
            if (Array.isArray(parsed)) {
              itemsGuardados = parsed;
            } else {
              console.warn('[Hook] itemsJson no es un array, se ignorará.');
            }
          } catch (e) {
            console.error('[Hook] Error parseando itemsJson:', e);
          }

          if (itemsGuardados.length > 0) {
            setItems(itemsGuardados);
            console.log('[Hook] Resumen cargado exitosamente.', itemsGuardados);
          }
        }
      } catch (err) {
        if (err?.status === 404) {
          console.log('[Hook] No se encontró un resumen guardado.');
          setItems([]);
        } else {
          console.error('[Hook] Error al cargar el resumen:', err);
          setError(err?.message || 'Error cargando resumen');
        }
      } finally {
        setIsLoading(false);
      }
    };

    cargarResumenGuardado();
  }, [client, idLicitacion]); // Se re-ejecuta si el ID de la licitación cambia


  //Función de Guardado 
  const guardarResumen = useCallback(async (itemsActuales) => {
    if (!client || !idLicitacion) {
      console.error("ID no disponibles para guardar.");
      return false;
    }

    console.log("[Hook] Guardando progreso...");
    setIsSaving(true);
    setError(null);

    try {
      const itemsJsonString = JSON.stringify(itemsActuales ?? []);
      // Evitar saves duplicados si el contenido no cambió
      const currentHash = typeof window !== 'undefined' && window.crypto?.subtle
        ? null
        : itemsJsonString; // fallback simple
      if (currentHash && lastSavedHashRef.current === currentHash) {
        console.log('No hay cambios en items, omitiendo guardado.');
        setIsSaving(false);
        return true;
      }
      
      await client.request({
        url: `${API_BASE_URL}/licitacion/${idLicitacion}/resumen`,
        type: 'POST',
        cors: true,
        contentType: 'application/json',
        data: JSON.stringify({ itemsJson: itemsJsonString })
      });

      console.log("Resumen guardado correctamente");
      lastSavedHashRef.current = currentHash || itemsJsonString;
      setLastSavedAt(new Date());
      setIsSaving(false);
      return true; // se guardó bn

    } catch (err) {
      console.error("Error al guardar el resumen ", err);
      setError(err?.message || 'Error guardando resumen');
      setIsSaving(false);
      return false; // Guardado fallido
    }
  }, [client, idLicitacion]);

  return {
    itemsCotizacion: items,
    setItemsCotizacion: setItems,
    guardarResumen,
    isLoadingResumen: isLoading,
    isSavingResumen: isSaving,
    errorResumen: error,
    lastSavedAt
  };
};