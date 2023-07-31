import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';
import { StateType } from '../reducers';

export const Footer: React.FC = () => {
  const abuseEmail = useSelector((state: StateType) => state.abuseEmail);
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <ul>
        <li>
          <Link to="/privacy">{t('sections.privacy')}</Link>
        </li>
        <li>
          <Link to="/tos">{t('sections.terms')}</Link>
        </li>
        {abuseEmail && (
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
};
