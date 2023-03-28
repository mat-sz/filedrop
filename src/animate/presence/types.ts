/**
 * @public
 */
export interface AnimatePresenceProps {
  /**
   * By passing `initial={false}`, `AnimatePresence` will disable any initial animations on children
   * that are present when the component is first rendered.
   *
   * ```jsx
   * <AnimatePresence initial={false}>
   *   {isVisible && (
   *     <motion.div
   *       key="modal"
   *       initial={{ opacity: 0 }}
   *       animate={{ opacity: 1 }}
   *       exit={{ opacity: 0 }}
   *     />
   *   )}
   * </AnimatePresence>
   * ```
   */
  initial?: boolean;

  /**
   * When a component is removed, there's no longer a chance to update its props. So if a component's `exit`
   * prop is defined as a dynamic variant and you want to pass a new `custom` prop, you can do so via `AnimatePresence`.
   * This will ensure all leaving components animate using the latest data.
   */
  custom?: any;

  /**
   * Fires when all exiting nodes have completed animating out.
   */
  onExitComplete?: () => void;

  /**
   * Determines how to handle entering and exiting elements.
   *
   * - `"sync"`: Default. Elements animate in and out as soon as they're added/removed.
   * - `"popLayout"`: Exiting elements are "popped" from the page layout, allowing sibling
   *      elements to immediately occupy their new layouts.
   */
  mode?: 'sync' | 'popLayout';
}
