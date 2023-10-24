import React from 'react';
import { useTranslation } from 'react-i18not';
import { IoCopy } from 'react-icons/io5/index.js';

import { IconButton, IconButtonProps } from './IconButton.js';

export interface CopyButtonProps
  extends Omit<IconButtonProps, 'title' | 'href' | 'download' | 'children'> {}

export const CopyButton: React.FC<CopyButtonProps> = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    <IconButton {...props} title={t('copy')}>
      <IoCopy />
    </IconButton>
  );
};
