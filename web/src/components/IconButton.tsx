import React from 'react';
import clsx from 'clsx';

import styles from './IconButton.module.scss';

export interface IconButtonProps
  extends Omit<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
    'ref'
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
        {...props}
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
