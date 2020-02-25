import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

import { abuseEmail } from '../config';

const Header: React.FC = () => {
    const [ toggled, setToggled ] = useState(false);

    const toggle = () => setToggled(toggled => !toggled);

    return (
        <header>
            <button className={'toggle ' + (toggled ? 'toggled' : '')} onClick={toggle}>
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
            </button>
            <nav className="menu">
                <h1>
                    <Link to="/" className="logo">{ process.env.REACT_APP_TITLE }</Link>
                </h1>
                <ul className={toggled ? '' : 'hidden'}>
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
