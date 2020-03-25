const transitionProps = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
};

export const animationPropsOpacity = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: transitionProps,
};

export const animationPropsRotation = {
  initial: { scale: 0 },
  animate: { rotate: 360, scale: 1 },
  exit: { scale: 0 },
  transition: transitionProps,
  positionTransition: true,
};

export const animationPropsSlide = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
  transition: transitionProps,
  positionTransition: true,
};
