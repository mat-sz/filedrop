import { useEffect } from 'react';

export function useUnmountEffect(callback: () => void) {
  // eslint-disable-next-line
  return useEffect(() => () => callback(), []);
}
