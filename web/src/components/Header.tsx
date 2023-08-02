import React from 'react';
import { useTranslation } from 'react-i18not';
import {
  IoLogoGithub,
  IoInformationCircle,
  IoLogoTwitter,
} from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './Header.module.scss';
import { StateType } from '../reducers';
import { DropIcon } from './DropIcon';

export const Header: React.FC = () => {
  const appName = useSelector((state: StateType) => state.appName);
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <h1>
          <Link to="/" className={styles.logo}>
            <DropIcon />
            {appName}
          </Link>
        </h1>
        <div className={styles.right}>
          <Link to="/about" title={t('sections.about')}>
            <IoInformationCircle />
          </Link>
          <a
            href="https://github.com/mat-sz/filedrop"
            target="_blank"
            rel="noopener noreferrer"
            title={t('sections.github')}
          >
            <IoLogoGithub />
          </a>
          <a
            href="https://twitter.com/matsz_dev"
            target="_blank"
            rel="noopener noreferrer"
            title={t('sections.twitter')}
          >
            <IoLogoTwitter />
          </a>
        </div>
      </nav>
    </header>
  );
};
