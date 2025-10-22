import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const useLicitacionData = (idLicitacion) => {
  const [data, setData] = useState({
    idLicitacion: null,
    fechaLicitacion: null,
    empresaCompradora: 'Sin información',
    fechaCierreOferta: null,
    comentariosGenerales: null,
    linkMasDetalles: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idLicitacion) {
      setData({
        idLicitacion: null,
        fechaLicitacion: null,
        empresaCompradora: 'Sin ID de licitación',
        fechaCierreOferta: null,
        comentariosGenerales: null,
        linkMasDetalles: null
      });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('licitación ID:', idLicitacion);

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
        console.log('✅ Datos recibidos de la API:', json);

        // La respuesta de la API ahora tiene esta estructura:
        // {
        //   idLicitacion: String,
        //   fechaLicitacion: String,
        //   empresaCompradora: String,
        //   fechaCierreOferta: String,
        //   comentariosGenerales: String,
        //   linkMasDetalles: String
        // }
        setData({
          idLicitacion: json.idLicitacion,
          fechaLicitacion: json.fechaLicitacion,
          empresaCompradora: json.empresaCompradora || 'Sin información del cliente',
          fechaCierreOferta: json.fechaCierreOferta,
          comentariosGenerales: json.comentariosGenerales || null,
          linkMasDetalles: json.linkMasDetalles || null
        });
        setError(null);
      } catch (err) {
        console.error('❌ Error al cargar licitación:', err);
        setError(err.message);

        // Datos de fallback cuando hay error
        setData({
          idLicitacion: idLicitacion,
          fechaLicitacion: null,
          empresaCompradora: 'Error al cargar datos',
          fechaCierreOferta: null,
          comentariosGenerales: 'No se pudo cargar la información',
          linkMasDetalles: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idLicitacion]);

  return { data, loading, error };
};
