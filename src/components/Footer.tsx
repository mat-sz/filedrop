import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { abuseEmail } from '../config';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <ul>
        <li>
          <Link to="/privacy">{t('sections.privacy')}</Link>
        </li>
        <li>
          <Link to="/tos">{t('sections.terms')}</Link>
        </li>
        {abuseEmail ? (
          <li>
            <Link to="/abuse">{t('sections.abuse')}</Link>
          </li>
        ) : null}
        <li>
          <Link to="/tech">{t('sections.tech')}</Link>
        </li>
        <li>
          <a
            href="https://github.com/mat-sz/filedrop-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('sections.github')}
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
