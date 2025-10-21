import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export const useRulifas = () => {
  const [rubros, setRubros] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener rubros 
  useEffect(() => {
    obtenerRubros();
  }, []);

  const obtenerRubros = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/datos-internos/licitacion/rubros`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Rubros obtenidos:', data);
      
      setRubros(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error al obtener rubros:', err);
      setError(err.message);
      setRubros([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obtenerLineas = async (idRubro) => {
    if (!idRubro) {
      setLineas([]);
      setFamilias([]);
      return [];
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/datos-internos/licitacion/lineas/${idRubro}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Líneas obtenidas:', data);
      
      setLineas(data);
      setFamilias([]); // Limpiar familias al cambiar rubro
      setError(null);
      return data;
    } catch (err) {
      console.error('Error al obtener líneas:', err);
      setError(err.message);
      setLineas([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const obtenerFamilias = async (idLinea) => {
    if (!idLinea) {
      setFamilias([]);
      return [];
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/datos-internos/licitacion/familias/${idLinea}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Familias obtenidas:', data);
      
      setFamilias(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('Error al obtener familias:', err);
      setError(err.message);
      setFamilias([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    rubros,
    lineas,
    familias,
    loading,
    error,
    obtenerLineas,
    obtenerFamilias,
    obtenerRubros 
  };
};