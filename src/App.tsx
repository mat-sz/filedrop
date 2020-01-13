import React from 'react';
import {
    Switch,
    Route,
    Link
} from 'react-router-dom';
import GithubCorner from 'react-github-corner';

import './App.scss';

import Home from './screens/Home';
import Transfers from './screens/Transfers';
import Privacy from './screens/Privacy';
import ToS from './screens/ToS';
import Status from './components/Status';
import { Router } from './config';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <GithubCorner href="https://github.com/mat-sz/filedrop-web" octoColor="#111" bannerColor="#fc03a1" />
                <header>
                    <nav className="menu">
                        <h1>
                            <Link to="/" className="logo">{ process.env.REACT_APP_TITLE }</Link>
                        </h1>
                    </nav>
                </header>
                <Status />
                <Switch>
                    <Route path="/privacy">
                        <Privacy />
                    </Route>
                    <Route path="/tos">
                        <ToS />
                    </Route>
                    <Route path="/:networkName">
                        <Transfers />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
                <footer>
                    <a href="https://github.com/mat-sz/filedrop-web">filedrop-web</a>
                    <Link to="/privacy">privacy policy</Link>
                    <Link to="/tos">terms of service</Link>
                </footer>
            </div>
        </Router>
    );
}

export default App;
