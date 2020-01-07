import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import './App.scss';

import Transfers from './screens/Transfers';
import Home from './screens/Home';
import { useSelector } from 'react-redux';
import { StateType } from './reducers';

const App: React.FC = () => {
    const connected = useSelector((state: StateType) => state.connected);
    
    return (
        <Router>
            <div className="app">
                <div>
                    { connected ? 'Connected' : 'Connecting...' }
                </div>
                <Switch>
                    <Route path="/transfers/:code">
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
