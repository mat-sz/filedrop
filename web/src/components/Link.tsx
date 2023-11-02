import React, { forwardRef } from 'react';
import { useLocation, useRouter } from 'wouter';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

export const Link: React.FC<LinkProps> = forwardRef<
  HTMLAnchorElement,
  LinkProps
>((props, ref) => {
  const router = useRouter();
  const [, navigate] = useLocation();

  const { to, onClick, children, ...aProps } = props;

  return (
    <a
      ref={ref}
      {...aProps}
      href={to[0] === '~' ? to.slice(1) : router.base + to}
      onClick={event => {
        // ignores the navigation when clicked using right mouse button or
        // by holding a special modifier key: ctrl, command, win, alt, shift
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.shiftKey ||
          event.button !== 0
        )
          return;

        onClick && onClick(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
});
