import { useCallback } from 'react';
import { useClient } from './useClient';

const API_BASE_URL = 'http://localhost:8080/datos-internos';


export const useObtenerSugerencia = () => {
  const client = useClient();

  const obtenerSugerencia = useCallback(async (itemSolicitado) => {

    if (!client) {
      throw new Error("ZAF Client no está listo.");
    }

    try {
      const params = new URLSearchParams({
          descripcion: itemSolicitado.descripcion
      });

      const productoTop1 = await client.request({
        url: `${API_BASE_URL}/catalogo/sugerencia-directa?${params.toString()}`,
        type: 'GET',
        cors: true
      });

      const productoParaModal = {
        id: productoTop1.id,
        nombreCobol: productoTop1.nombreCobol,
        precioUnitario: productoTop1.precio || 0
      };
      
      return {
        producto: productoParaModal,
        cantidad: itemSolicitado.cantidad
      };

    } catch (err) {

        
      console.warn("No se encontró sugerencia directa (o hubo un error):", err);
      return null; 
    }
  }, [client]); 

  return { obtenerSugerencia };
};