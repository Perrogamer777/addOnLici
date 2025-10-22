import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const useProductosSoli = (idLicitacion) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idLicitacion) {
      setProductos([]);
      return;
    }
    obtenerProductos(idLicitacion);
  }, [idLicitacion]);

  const obtenerProductos = async (idLicitacion) => {
    try {
      setLoading(true);
      console.log(`Consultando productos para licitación ${idLicitacion}...`);
      
      const response = await fetch(`${API_BASE_URL}/datos-internos/licitacion/${idLicitacion}/productos`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No se encontraron productos para la licitación ${idLicitacion}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Productos obtenidos:', data);


      // info recibida { idLicitacion, skuWherex, descripcionArticulo, categoria, unidades }
      const productosTransformados = data.map(p => ({
        sku: p.skuWherex?.toString() || 'Sin SKU',
        descripcion: p.descripcionArticulo || 'Sin descripción',
        cantidad: p.unidades || 0,
        categoria: p.categoria || 'Sin categoría',
        unidad: 'unidad' // Valor por defecto
      }));

      setProductos(productosTransformados);
      setError(null);
      return productosTransformados;
    } catch (err) {
      console.error('Error al obtener productos solicitados:', err);
      setError(err.message);
      setProductos([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    loading,
    error,
    obtenerProductos
  };
};
