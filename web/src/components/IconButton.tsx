import React from 'react';
import clsx from 'clsx';

import styles from './IconButton.module.scss';

interface IconButtonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  href?: string;
  download?: string;
  round?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className,
  href,
  download,
  round,
  ...props
}) => {
  if (href) {
    return (
      <a
        className={clsx(
          styles.iconButton,
          { [styles.round]: round },
          className
        )}
        href={href}
        download={download}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={clsx(styles.iconButton, { [styles.round]: round }, className)}
      {...props}
    >
      {children}
    </button>
  );
};
