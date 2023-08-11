import React from 'react';
import { useTranslation } from 'react-i18not';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Footer.module.scss';
import { observer } from 'mobx-react-lite';
import { applicationStore } from '../stores';

export const Footer: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <footer className={clsx('subsection', styles.footer)}>
      <ul>
        <li>
          <Link to="/privacy">{t('sections.privacy')}</Link>
        </li>
        <li>
          <Link to="/tos">{t('sections.terms')}</Link>
        </li>
        {applicationStore.abuseEmail && (
          <li>
            <Link to="/abuse">{t('sections.abuse')}</Link>
          </li>
        )}
        <li>
          <Link to="/tech">{t('sections.tech')}</Link>
        </li>
        <li>
          <a
            href="https://github.com/mat-sz/filedrop"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('sections.github')}
          </a>
        </li>
      </ul>
    </footer>
  );
});
