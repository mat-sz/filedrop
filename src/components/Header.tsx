import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaInfoCircle, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { title } from '../config';
import DropIcon from './DropIcon';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header>
      <nav className="menu">
        <h1>
          <Link to="/" className="logo">
            <DropIcon />
            {title}
          </Link>
        </h1>
        <div className="icon-menu">
          <Link to="/about" title={t('sections.about')}>
            <FaInfoCircle />
          </Link>
          <a
            href="https://github.com/mat-sz/filedrop-web"
            target="_blank"
            rel="noopener noreferrer"
            title={t('sections.github')}
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com/matsz_dev"
            target="_blank"
            rel="noopener noreferrer"
            title={t('sections.twitter')}
          >
            <FaTwitter />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
