import React from 'react';
import { Link } from 'react-router-dom';

import { abuseEmail } from '../config';

const Footer: React.FC = () => {
  return (
    <footer>
      <ul>
        <li>
          <Link to="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/tos">Terms of Service</Link>
        </li>
        {abuseEmail ? (
          <li>
            <Link to="/abuse">Report abuse / DMCA</Link>
          </li>
        ) : null}
        <li>
          <Link to="/tech">Technical Information</Link>
        </li>
        <li>
          <a
            href="https://github.com/mat-sz/filedrop-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
