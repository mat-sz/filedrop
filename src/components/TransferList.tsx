import React from 'react';

import Transfer from './Transfer';
import { TransferModel } from '../types/Models';

const TransferList: React.FC<{
    transfers: TransferModel[],
}> = ({ transfers }) => {
    if (transfers.length === 0) return null;

    return (
        <>
            <ul className="center queue">
                { transfers.map((transfer) =>
                    <Transfer
                        key={transfer.transferId}
                        transfer={transfer}
                    />
                ) }
            </ul>
        </>
    );
}

export default TransferList;
