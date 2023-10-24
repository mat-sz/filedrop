import React from 'react';
import { useTranslation } from 'react-i18not';
import { IoCopy } from 'react-icons/io5';
import { clsx } from 'clsx';

import { useTimedState } from '../utils/hooks.js';
import styles from './CopyButton.module.scss';
import { IconButton, IconButtonProps } from './IconButton.js';

export interface CopyButtonProps
  extends Omit<IconButtonProps, 'title' | 'href' | 'download' | 'children'> {
  onClick: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  onClick,
  ...props
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useTimedState(false);

  return (
    <IconButton
      onClick={() => {
        onClick();
        setCopied(true);
      }}
      {...props}
      title={t('copy')}
    >
      <div className={clsx(styles.feedback, { [styles.visible]: copied })}>
        {t('copied')}
      </div>
      <IoCopy />
    </IconButton>
  );
};
