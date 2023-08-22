import React from 'react';
import clsx from 'clsx';

import styles from './Tooltip.module.scss';

interface TooltipProps {
  content: React.ReactNode;
  wrapperClassName?: string;
  tooltipClassName?: string;
  children: React.ReactNode;
  location?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  wrapperClassName,
  tooltipClassName,
  location = 'top',
}) => {
  return (
    <div className={clsx(styles.wrapper, wrapperClassName)}>
      {children}
      <div className={clsx(styles.tooltip, tooltipClassName, styles[location])}>
        {content}
      </div>
    </div>
  );
};
