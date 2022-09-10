import React from 'react';
import { useTranslation } from 'react-i18next';

const IncompatibleBrowser: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="subsection warning">
      <h2>{t('incompatibleBrowser.title')}</h2>
      <p>{t('incompatibleBrowser.body')}</p>
    </div>
  );
};

export default IncompatibleBrowser;
