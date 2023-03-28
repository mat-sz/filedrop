import * as React from 'react';
import { usePresence } from '../presence/use-presence';
import { DOMMotionComponents, MotionProps } from './types';

/**
 * I'd rather the return type of `custom` to be implicit but this throws
 * incorrect relative paths in the exported types and API Extractor throws
 * a wobbly.
 */
export type CustomDomComponent<Props> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<Props & MotionProps> &
    React.RefAttributes<SVGElement | HTMLElement>
>;

type ComponentType<Props extends {}> =
  | string
  | React.ComponentType<React.PropsWithChildren<Props>>;

function createMotionComponent<Props extends {}>(
  Component: ComponentType<Props>
) {
  function MotionComponent(
    props: Props & MotionProps,
    externalRef?: React.Ref<HTMLElement | SVGElement>
  ) {
    const { initial, animate, exit } = props;
    const [isPresent, safeToRemove] = usePresence();
    const componentRef = React.useRef<HTMLElement | SVGElement | null>(null);

    if (externalRef) {
      if (typeof externalRef === 'function') {
        externalRef(componentRef.current);
      } else if ('current' in externalRef) {
        (externalRef as any).current = componentRef.current;
      }
    }

    React.useEffect(() => {
      if (!componentRef.current && !isPresent) {
        safeToRemove?.();
        return;
      }

      if (!isPresent) {
        if (!animate || !exit) {
          safeToRemove?.();
          return;
        }

        const animation = new Animation(
          new KeyframeEffect(componentRef.current, [animate, exit], {
            fill: 'forwards',
            easing: 'ease-in-out',
            duration: 250,
          })
        );

        if (safeToRemove) {
          animation.addEventListener('finish', safeToRemove, { once: true });
          animation.addEventListener('cancel', safeToRemove, { once: true });
        }

        animation.play();
      } else if (initial && animate) {
        const animation = new Animation(
          new KeyframeEffect(componentRef.current, [initial, animate], {
            fill: 'forwards',
            easing: 'ease-in-out',
            duration: 250,
          })
        );

        animation.play();
      }
    }, [isPresent, safeToRemove, initial, animate, exit]);

    return <Component ref={componentRef} {...props} />;
  }

  return React.forwardRef(MotionComponent);
}

/**
 * Convert any React component into a `motion` component. The provided component
 * **must** use `React.forwardRef` to the underlying DOM component you want to animate.
 *
 * ```jsx
 * const Component = React.forwardRef((props, ref) => {
 *   return <div ref={ref} />
 * })
 *
 * const MotionComponent = motion(Component)
 * ```
 *
 * @public
 */
export function createMotionProxy() {
  function custom<Props extends {}>(
    Component: ComponentType<Props>
  ): CustomDomComponent<Props> {
    return createMotionComponent<Props>(Component);
  }

  if (typeof Proxy === 'undefined') {
    return custom as typeof custom & DOMMotionComponents;
  }

  /**
   * A cache of generated `motion` components, e.g `motion.div`, `motion.input` etc.
   * Rather than generating them anew every render.
   */
  const componentCache = new Map<string, any>();

  return new Proxy(custom, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key: string) => {
      /**
       * If this element doesn't exist in the component cache, create it and cache.
       */
      if (!componentCache.has(key)) {
        componentCache.set(key, custom(key));
      }

      return componentCache.get(key)!;
    },
  }) as typeof custom & DOMMotionComponents;
}
