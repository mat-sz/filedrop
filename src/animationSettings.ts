const transitionProps = {
    type: 'spring',
    stiffness: 260,
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

export const animationPropsScale = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: transitionProps,
    positionTransition: true,
};