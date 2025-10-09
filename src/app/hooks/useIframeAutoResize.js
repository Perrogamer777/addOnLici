import { useEffect } from 'react';

export function useIframeAutoResize(client, ref, dependencies) {
  useEffect(() => {
    if (!client || !ref.current) return;
    const resize = () => {
      const height = ref.current.scrollHeight;
      client.invoke('resize', { width: '100%', height: `${height}px` });
    };
    resize();
    // Re-calcula el tamaño si las dependencias cambian (ej. al agregar items)
    const observer = new MutationObserver(resize);
    observer.observe(ref.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [client, ref, ...dependencies]);
}
