import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StateType } from '../reducers';

const Home: React.FC = () => {
    const name = useSelector((state: StateType) => state.name);

    return (
        <div className="section center">
            <Link to={"/" + name} className="button">Receive files</Link>
        </div>
    );
}

export default Home;
