import React from 'react';
import { FaGithub, FaInfoCircle, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { title } from '../config';
import DropIcon from './DropIcon';

const Header: React.FC = () => {
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
          <Link to="/about">
            <FaInfoCircle />
          </Link>
          <a
            href="https://github.com/mat-sz/filedrop-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com/matsz_dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
