import { useEffect } from 'react';

export function useIframeAutoResize(client, ref, deps = []) {
  useEffect(() => {
    if (!client || !ref?.current) return;
    const el = ref.current;

    const resizeToContent = () => {
      const minH = 520;
      const maxH = 1400;
      const needed = Math.ceil(el.scrollHeight);
      const target = Math.max(minH, Math.min(maxH, needed));
      client.invoke('resize', { width: '100%', height: `${target}px` });
    };

    resizeToContent();
    const ro = new ResizeObserver(resizeToContent);
    ro.observe(el);
    return () => ro.disconnect();
  }, [client, ref, ...deps]);
}