import React from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import GithubCorner from 'react-github-corner';

import './App.scss';

import Header from './components/Header';
import Home from './screens/Home';
import Transfers from './screens/Transfers';
import Privacy from './screens/Privacy';
import ToS from './screens/ToS';
import Abuse from './screens/Abuse';
import Status from './components/Status';
import { Router, abuseEmail } from './config';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <div className="line"></div>
                <GithubCorner href="https://github.com/mat-sz/filedrop-web" octoColor="#111" bannerColor="#fc03a1" />
                <Header />
                <Status />
                <Switch>
                    { abuseEmail ?
                    <Route path="/abuse">
                        <Abuse />
                    </Route> : null }
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
            </div>
        </Router>
    );
}

export default App;
