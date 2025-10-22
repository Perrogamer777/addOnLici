import { useState, useEffect } from 'react';
import { useClient } from './useClient';

export const useTicketIdFromZendesk = () => {
  const client = useClient();
  const [idLicitacion, setIdLicitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }

    const fetchTicketId = async () => {
      try {
        setLoading(true);
        
        // Obtener el subject (título) del ticket
        const ticketData = await client.get('ticket.subject');
        const ticketSubject = ticketData['ticket.subject'];
        
        console.log('Título del ticket:', ticketSubject);
        
        // Extraer el ID de licitación con formato LIC-XXXX
        const match = ticketSubject.match(/LIC-\d+/i);
        
        if (!match) {
          throw new Error('No se encontró ID de licitación con formato LIC-XXX en el título del ticket');
        }
        
        // Extraer el ID completo (ej: "LIC-96")
        const licitacionId = match[0].toUpperCase(); 
        console.log('ID de licitación extraído:', licitacionId);
        
        setIdLicitacion(licitacionId);
        setError(null);
      } catch (err) {
        console.error('Error al obtener ID de licitación:', err);
        setError(err.message);
        setIdLicitacion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketId();
  }, [client]);

  return { idLicitacion, loading, error };
};
