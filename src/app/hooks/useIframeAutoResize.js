import { useEffect } from 'react';

export function useIframeAutoResize(client, mainRef, dependencies = []) {
  useEffect(() => {
    if (!client || !mainRef.current) return;

    const resizeIframe = () => {
      try {
        const height = Math.max(
          mainRef.current.scrollHeight,
          mainRef.current.offsetHeight,
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          1000 // Altura mínima
        );

      
        client.invoke('resize', { 
          width: '100%', 
          height: `${height}px` 
        });
      } catch (error) {

      }
    };

    // Resize inicial inmediato
    resizeIframe();
    
    // Resize después de que se cargue todo
    const timer = setTimeout(resizeIframe, 100);
    const timer2 = setTimeout(resizeIframe, 500);
    const timer3 = setTimeout(resizeIframe, 1000);

    // Observer para detectar cambios en el DOM
    const resizeObserver = new ResizeObserver(() => {
      resizeIframe();
    });

    if (mainRef.current) {
      resizeObserver.observe(mainRef.current);
    }

    // Escuchar cambios en el tamaño de ventana
    window.addEventListener('resize', resizeIframe);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resizeIframe);
    };
  }, [client, mainRef, ...dependencies]);
}
