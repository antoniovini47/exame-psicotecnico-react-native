import { useEffect, useRef, useState } from 'react';

const TICK_MS = 200;

export function useDeadline(deadline: number | null, onExpire: () => void): number {
  const [now, setNow] = useState(() => Date.now());
  const expire = useRef(onExpire);

  useEffect(() => {
    expire.current = onExpire;
  });

  useEffect(() => {
    if (deadline === null) return;
    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= deadline) {
        clearInterval(id);
        expire.current();
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [deadline]);

  return deadline === null ? 0 : Math.max(0, deadline - now);
}
