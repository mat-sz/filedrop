import { useState, useCallback, useRef } from 'react';
import { useIsMounted } from './use-is-mounted';

export function useForceUpdate(): [VoidFunction, number] {
  const isMounted = useIsMounted();
  const [forcedRenderCount, setForcedRenderCount] = useState(0);
  const timeoutRef = useRef<any>();

  const forceRender = useCallback(() => {
    isMounted.current && setForcedRenderCount(forcedRenderCount + 1);
    // eslint-disable-next-line
  }, [forcedRenderCount]);

  /**
   * Defer this to the end of the next animation frame in case there are multiple
   * synchronous calls.
   */
  const deferredForceRender = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(forceRender, 1000 / 60);
  }, [forceRender]);

  return [deferredForceRender, forcedRenderCount];
}
