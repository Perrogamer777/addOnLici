import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const useLicitacionData = (idLicitacion) => {
  const [data, setData] = useState({
    idLicitacion: null,
    idCliente: null,
    nombreCliente: 'Sin información',
    comentarios: 'Sin comentario'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idLicitacion) {
      setData({
        idLicitacion: null,
        idCliente: null,
        nombreCliente: 'Sin ID de licitación'
      });
      return;
    }

    //obtener datos cliente 
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Consultando API para licitación ID:', idLicitacion);

        const response = await fetch(
          `${API_BASE_URL}/datos-internos/licitacion/${idLicitacion}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Licitación ${idLicitacion} no encontrada en la base de datos`);
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        console.log('Datos recibidos de la API:', json);

        // La respuesta de la API tiene esta estructura:
        // { idLicitacion: Long, idCliente: Long, nombreCliente: String }
        setData({
          idLicitacion: json.idLicitacion,
          idCliente: json.idCliente,
          nombreCliente: json.nombreCliente || 'Sin información del cliente',
          fechaLimite: json.fechaLimite,
          comentarios: json.comentarios||'Sin comentario'
        });
        setError(null);
      } catch (err) {
        console.error('Error al cargar licitación:', err);
        setError(err.message);

        // Datos de fallback cuando hay error
        setData({
          idLicitacion: idLicitacion,
          idCliente: null,
          nombreCliente: 'Error al cargar datos'
        });
      } finally {
        setLoading(false);
      }
      //para obtener rubros
      const response = await fetch (`${API_BASE_URL}/datos-internos/licitacion/rubros`);
    };


    fetchData();
  }, [idLicitacion]);

  return { data, loading, error };
};
