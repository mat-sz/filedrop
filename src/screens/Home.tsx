import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { StateType } from '../reducers';
import { nameCharacterSet, nameLength } from '../config';

const Home: React.FC = () => {
    const name = useSelector((state: StateType) => state.networkName);
    const connected = useSelector((state: StateType) => state.connected);
    const clientId = useSelector((state: StateType) => state.clientId);
    const suggestedName = useSelector((state: StateType) => state.suggestedName);

    const history = useHistory();

    useEffect(() => {
        const name = suggestedName || new Array(nameLength).fill('').map(() => nameCharacterSet.charAt(Math.floor(Math.random() * nameCharacterSet.length))).join('');
        if (connected && clientId) {
            history.push("/" + name);
        }
    }, [ connected, name, history, clientId, suggestedName ]);

    return (
        <section className="center">
            Loading...
        </section>
    );
}

export default Home;
