import React, { useEffect } from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import './App.scss';

import Home from './screens/Home';
import Transfers from './screens/Transfers';
import Privacy from './screens/Privacy';
import { useSelector } from 'react-redux';
import { StateType } from './reducers';
import { title } from './config';

const App: React.FC = () => {
    const connected = useSelector((state: StateType) => state.connected);
    useEffect(() => {
        document.title = title;
    });

    return (
        <Router>
            <div className="app">
                <header>
                    <nav className="menu">
                        <h1>
                            <Link to="/" className="logo">{ title }</Link>
                        </h1>
                    </nav>
                </header>
                { !connected ? <div className={"status error"}>Not connected</div> : null }
                <Switch>
                    <Route path="/privacy">
                        <Privacy />
                    </Route>
                    <Route path="/:code">
                        <Transfers />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
                <footer>
                    <a href="https://github.com/mat-sz/filedrop-web">filedrop-web</a>
                    <Link to="/privacy">privacy policy</Link>
                </footer>
            </div>
        </Router>
    );
}

export default App;
