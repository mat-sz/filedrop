import React from 'react';
import { useTranslation } from 'react-i18next';

export const IncompatibleBrowser: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="subsection">
      <h2>{t('incompatibleBrowser.title')}</h2>
      <div>{t('incompatibleBrowser.body')}</div>
    </div>
  );
};
