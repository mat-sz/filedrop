import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { abuseEmail } from '../config';

const Header: React.FC = () => {
    const [ toggled, setToggled ] = useState(false);

    const toggle = () => setToggled(toggled => !toggled);

    return (
        <header>
            <button className={'toggle ' + (toggled ? 'toggled' : '')} onClick={toggle} aria-label={toggled ? 'Close menu' : 'Open menu'}>
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
            </button>
            <nav className="menu">
                <h1>
                    <Link to="/" className="logo" onClick={toggle}>{ process.env.REACT_APP_TITLE }</Link>
                </h1>
                <ul className={toggled ? '' : 'hidden'}>
                    <li>
                        <Link to="/privacy" onClick={toggle}>privacy policy</Link>
                    </li>
                    <li>
                        <Link to="/tos" onClick={toggle}>terms of service</Link>
                    </li>
                    { abuseEmail ?
                    <li>
                        <Link to="/abuse" onClick={toggle}>report abuse / dmca</Link>
                    </li>
                    : null }
                </ul>
            </nav>
        </header>
    );
}

export default Header;
