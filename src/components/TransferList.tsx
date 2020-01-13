import React from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import Transfer from './Transfer';
import { StateType } from '../reducers';

const TransferList: React.FC = () => {
    const transfers = useSelector((store: StateType) => store.transfers);

    return (
        <ul className="center queue">
            <AnimatePresence>
                { transfers.map((transfer) =>
                    <Transfer
                        key={transfer.transferId}
                        transfer={transfer}
                    />
                ) }
            </AnimatePresence>
        </ul>
    );
}

export default TransferList;
