import { useCallback } from 'react';
import { useClient } from './useClient';

const API_BASE_URL = 'http://localhost:8080/datos-internos';


export const useObtenerSugerencia = () => {
  const client = useClient();

  const obtenerSugerencia = useCallback(async (itemSolicitado) => {
    console.log(" Iniciando búsqueda para:", itemSolicitado);
    
    if (!client) {
      console.error("ZAF Client no está listo");
      throw new Error("ZAF Client no está listo.");
    }

    if (!itemSolicitado || !itemSolicitado.descripcion) {
      console.error("itemSolicitado o descripción faltante:", itemSolicitado);
      throw new Error("ItemSolicitado o descripción faltante");
    }

    try {
      const params = new URLSearchParams({
          descripcion: itemSolicitado.descripcion
      });

      const url = `${API_BASE_URL}/catalogo/sugerencia-directa?${params.toString()}`;
      console.log("URL de consulta sugerencia:", url);

      const productoTop1 = await client.request({
        url: url,
        type: 'GET',
        cors: true
      });

      console.log("Respuesta del API:", productoTop1);

      if (!productoTop1 || !productoTop1.id) {
        console.warn("Producto no encontrado o respuesta inválida:", productoTop1);
        return null;
      }

      const productoTransformado = {
        id: productoTop1.id,
        nombreCobol: productoTop1.nombreCobol,
        precio: productoTop1.precio || 0,
        precioUnitario: productoTop1.precio || 0,
        stockTotal: productoTop1.stockTotal || 0,
        marca: productoTop1.marca,
        categoria: productoTop1.categoria
      };
      
      const resultado = {
        producto: productoTransformado,
        cantidad: itemSolicitado.cantidad,
        originalSku: itemSolicitado.sku
      };

      console.log("Resultado transformado:", resultado);
      return resultado;

    } catch (err) {
      console.error("Error en la búsqueda:", err);
      console.error("Detalles del error:", {
        message: err.message,
        status: err.status,
        responseJSON: err.responseJSON,
        itemSolicitado: itemSolicitado
      });
      return null; 
    }
  }, [client]); 

  return { obtenerSugerencia };
};