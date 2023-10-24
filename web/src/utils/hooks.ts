import { useRef, useState } from 'react';

export function useTimedState<T>(
  initialValue: T,
  timeoutMs = 2000
): [T, (value: T) => void] {
  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef<any>();

  return [
    value,
    (value: T) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setValue(initialValue);
      }, timeoutMs);
      setValue(value);
    },
  ];
}
