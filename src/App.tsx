import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import './App.scss';

import Home from './screens/Home';
import Transfers from './screens/Transfers';
import Privacy from './screens/Privacy';
import { useSelector } from 'react-redux';
import { StateType } from './reducers';

const App: React.FC = () => {
    const connected = useSelector((state: StateType) => state.connected);

    return (
        <Router>
            <div className="app">
                <div className="logo section">drop.lol</div>
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
            </div>
        </Router>
    );
}

export default App;
