import { usePresence } from 'framer-motion';
import React, { HTMLAttributes, useEffect, useRef } from 'react';

interface AnimateProps extends HTMLAttributes<HTMLElement> {
  component?: 'div' | 'span' | 'li';
  initial?: Keyframe;
  animate?: Keyframe;
  exit?: Keyframe;
  children?: React.ReactNode;
}

const Animate: React.FC<AnimateProps> = props => {
  const { component = 'div', initial, animate, exit, children } = props;
  const Component = component;
  const [isPresent, safeToRemove] = usePresence();
  const componentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isPresent) {
      if (componentRef.current && animate && exit) {
        const animation = new Animation(
          new KeyframeEffect(componentRef.current, [animate, exit], {
            easing: 'ease-in-out',
            duration: 250,
          })
        );

        if (safeToRemove) {
          animation.addEventListener('finish', safeToRemove, { once: true });
          animation.addEventListener('cancel', safeToRemove, { once: true });
        }

        animation.play();
      } else {
        safeToRemove?.();
      }
    } else if (componentRef.current && initial && animate) {
      const animation = new Animation(
        new KeyframeEffect(componentRef.current, [initial, animate], {
          easing: 'ease-in-out',
          duration: 250,
        })
      );

      animation.play();
    }
  }, [isPresent, safeToRemove, initial, animate, exit]);

  return (
    <Component ref={componentRef as any} {...props}>
      {children}
    </Component>
  );
};

export default Animate;
