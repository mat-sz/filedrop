import React from 'react';
import clsx from 'clsx';

import styles from './IconButton.module.scss';

interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
  href?: string;
  download?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  className,
  href,
  download,
  ...props
}) => {
  if (href) {
    return (
      <a
        className={clsx(styles.iconButton, className)}
        href={href}
        download={download}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={clsx(styles.iconButton, className)} {...props}>
      {children}
    </button>
  );
};
