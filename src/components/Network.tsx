import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import { StateType } from '../reducers';
import NetworkTile from './NetworkTile';

interface NetworkProps {
    onSelect?: (clientId: string) => void,
};

const Network: React.FC<NetworkProps> = ({ onSelect }) => {
    const network = useSelector((store: StateType) => store.network);

    return (
        <>
            { network.length > 0 ?
            <div className="subsection network">
                <AnimatePresence>
                    { network.map((client) =>
                        <NetworkTile
                            key={client.clientId}
                            client={client}
                            onSelect={onSelect}
                        />
                    ) }
                </AnimatePresence>
            </div>
            :
            <div className="subsection">
                Nobody is connected to your network.
            </div>
            }
        </>
    );
}

export default Network;
