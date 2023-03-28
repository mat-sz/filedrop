import { useContext, useEffect, useId } from 'react';
import { PresenceContext, PresenceContextProps } from './PresenceContext';

export type SafeToRemove = () => void;

type AlwaysPresent = [true, null];

type Present = [true];

type NotPresent = [false, SafeToRemove];

/**
 * When a component is the child of `AnimatePresence`, it can use `usePresence`
 * to access information about whether it's still present in the React tree.
 *
 * ```jsx
 * import { usePresence } from "framer-motion"
 *
 * export const Component = () => {
 *   const [isPresent, safeToRemove] = usePresence()
 *
 *   useEffect(() => {
 *     !isPresent && setTimeout(safeToRemove, 1000)
 *   }, [isPresent])
 *
 *   return <div />
 * }
 * ```
 *
 * If `isPresent` is `false`, it means that a component has been removed the tree, but
 * `AnimatePresence` won't really remove it until `safeToRemove` has been called.
 */
export function usePresence(): AlwaysPresent | Present | NotPresent {
  const context = useContext(PresenceContext);

  if (context === null) return [true, null];

  const { isPresent, onExitComplete, register } = context;

  // It's safe to call the following hooks conditionally (after an early return) because the context will always
  // either be null or non-null for the lifespan of the component.

  // eslint-disable-next-line
  const id = useId();
  // eslint-disable-next-line
  useEffect(() => register(id), []);

  const safeToRemove = () => onExitComplete && onExitComplete(id);

  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}

export function isPresent(context: PresenceContextProps | null) {
  return context === null ? true : context.isPresent;
}
