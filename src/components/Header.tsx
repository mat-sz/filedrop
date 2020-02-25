import React from 'react';
import { Link } from 'react-router-dom';

import { abuseEmail } from '../config';

const Header: React.FC = () => {
    return (
        <header>
            <nav className="menu">
                <h1>
                    <Link to="/" className="logo">{ process.env.REACT_APP_TITLE }</Link>
                </h1>
                <ul>
                    <li>
                        <Link to="/privacy">privacy policy</Link>
                    </li>
                    <li>
                        <Link to="/tos">terms of service</Link>
                    </li>
                    { abuseEmail ?
                    <li>
                        <Link to="/abuse">report abuse / dmca</Link>
                    </li>
                    : null }
                </ul>
            </nav>
        </header>
    );
}

export default Header;
