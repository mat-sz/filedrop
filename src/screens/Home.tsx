import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StateType } from '../reducers';

const Home: React.FC = () => {
    const name = useSelector((state: StateType) => state.name);
    const history = useHistory();

    useEffect(() => {
        history.push("/" + name);
    });

    return (
        <div className="section center">
            Loading...
        </div>
    );
}

export default Home;
