import React from 'react';
import clsx from 'clsx';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  content: React.ReactNode;
  wrapperClassName?: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  wrapperClassName,
}) => {
  return (
    <div className={clsx(styles.wrapper, wrapperClassName)}>
      {children}
      <div className={styles.tooltip}>{content}</div>
    </div>
  );
};
