import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  wrapperClassName?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  wrapperClassName,
}) => {
  return (
    <div className={`tooltip-wrapper ${wrapperClassName ?? ''}`}>
      {children}
      <div className="tooltip">{content}</div>
    </div>
  );
};

export default Tooltip;
