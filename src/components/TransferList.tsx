import React from 'react';

import Transfer from './Transfer';
import { TransferModel } from '../types/Models';

const titles = {
    active: 'Active transfers:',
    incoming: 'Incoming transfers:',
    outgoing: 'Your transfers:',
};

const TransferList: React.FC<{
    transfers: TransferModel[],
    type: 'active' | 'incoming' | 'outgoing',
}> = ({ transfers, type }) => {

    if (transfers.length === 0) return null;

    return (
        <>
            <h2>{ titles[type] }</h2>
            <ul className="center queue">
                { transfers.map((transfer) =>
                    <Transfer
                        key={transfer.transferId}
                        transfer={transfer}
                        type={type}
                    />
                ) }
            </ul>
        </>
    );
}

export default TransferList;
