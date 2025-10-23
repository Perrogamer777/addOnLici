import { useState, useEffect } from 'react';

// Definimos la URL base de tu API
const API_BASE_URL = 'http://localhost:8080/datos-internos';

export const useStockSucursalData = (codArt) => {

  const [stockSucursales, setStockSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // se ejecuts cada vez que 'codArt' cambie
  useEffect(() => {
    
    if (!codArt) {
      setStockSucursales([]); 
      setLoading(false);
      return; 
    }

    const fetchStockSucursales = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/catalogo/productos/${codArt}/stock-sucursales`
        );

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log(`Stock por sucursal para ID de producto: ${codArt}:`, data);
        setStockSucursales(data || []);

      } catch (err) {
        console.error('Error al cargar stock por sucursal:', err);
        setError(err.message);
        setStockSucursales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStockSucursales();

  }, [codArt]); // se jecuta si 'codArt' cambia

  return { stockSucursales, loading, error };
};