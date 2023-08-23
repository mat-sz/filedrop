import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen?: boolean;
  className?: string;
}

export const Portal: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  isOpen,
  className,
}) => {
  const elementRef = useRef<HTMLDivElement>(document.createElement('div'));

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element.parentNode) {
      document.body.appendChild(element);
    }

    return () => {
      element.parentNode?.removeChild(element);
    };
  }, []);

  useEffect(() => {
    elementRef.current.className = className || '';
  }, [className]);

  if (!isOpen) {
    return null;
  }

  return createPortal(children, elementRef.current);
};
