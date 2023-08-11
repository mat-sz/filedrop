import React from 'react';
import { useTranslation } from 'react-i18not';

import { isBrowserCompatible } from '../../utils/browser.js';

export const IncompatibleBrowserSection: React.FC = () => {
  const { t } = useTranslation();

  if (isBrowserCompatible) {
    return null;
  }

  return (
    <div className="subsection">
      <h2>{t('incompatibleBrowser.title')}</h2>
      <div>{t('incompatibleBrowser.body')}</div>
    </div>
  );
};
