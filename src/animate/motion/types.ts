import {
  DetailedHTMLFactory,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactHTML,
  ReactSVG,
  RefAttributes,
  SVGAttributes,
} from 'react';

export interface MotionProps {
  initial?: Keyframe;
  animate?: Keyframe;
  exit?: Keyframe;
}

export type ForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type UnwrapFactoryAttributes<F> = F extends DetailedHTMLFactory<infer P, any>
  ? P
  : never;
type UnwrapFactoryElement<F> = F extends DetailedHTMLFactory<any, infer P>
  ? P
  : never;

export type HTMLMotionComponents = {
  [K in keyof ReactHTML]: ForwardRefComponent<
    UnwrapFactoryElement<ReactHTML[K]>,
    UnwrapFactoryAttributes<ReactHTML[K]> & MotionProps
  >;
};

type UnwrapSVGFactoryElement<F> = F extends React.SVGProps<infer P> ? P : never;

export type SVGMotionComponents = {
  [K in keyof ReactSVG]: ForwardRefComponent<
    UnwrapSVGFactoryElement<ReactSVG[K]>,
    SVGAttributes<SVGElement> & MotionProps
  >;
};

export type DOMMotionComponents = HTMLMotionComponents & SVGMotionComponents;
