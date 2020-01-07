import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="screen">
            <Link to="/transfers/123456">Receive files</Link>
        </div>
    );
}

export default Home;
