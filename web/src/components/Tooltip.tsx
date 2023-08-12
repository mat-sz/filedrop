import React from 'react';
import clsx from 'clsx';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  content: React.ReactNode;
  wrapperClassName?: string;
  tooltipClassName?: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  wrapperClassName,
  tooltipClassName,
}) => {
  return (
    <div className={clsx(styles.wrapper, wrapperClassName)}>
      {children}
      <div className={clsx(styles.tooltip, tooltipClassName)}>{content}</div>
    </div>
  );
};
