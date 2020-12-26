import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';

import Transfer, { cancellableStates } from './Transfer';
import { StateType } from '../reducers';
import {
  acceptTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  removeTransferAction,
} from '../actions/transfers';
import { TransferState } from '../types/TransferState';

const TransferList: React.FC = () => {
  const transfers = useSelector((store: StateType) => store.transfers);
  const dispatch = useDispatch();

  const acceptAll = useCallback(() => {
    transfers
      .filter(transfer => transfer.state === TransferState.INCOMING)
      .forEach(transfer => dispatch(acceptTransferAction(transfer.transferId)));
  }, [transfers, dispatch]);
  const rejectAll = useCallback(() => {
    transfers
      .filter(transfer => transfer.state === TransferState.INCOMING)
      .forEach(transfer => dispatch(rejectTransferAction(transfer.transferId)));
  }, [transfers, dispatch]);
  const cancelAll = useCallback(() => {
    transfers
      .filter(transfer => cancellableStates.includes(transfer.state))
      .forEach(transfer => dispatch(cancelTransferAction(transfer.transferId)));
  }, [transfers, dispatch]);
  const dismissAll = useCallback(() => {
    transfers
      .filter(
        transfer =>
          transfer.state === TransferState.COMPLETE ||
          transfer.state === TransferState.FAILED
      )
      .forEach(transfer => dispatch(removeTransferAction(transfer.transferId)));
  }, [transfers, dispatch]);

  return (
    <>
      {transfers.length !== 0 && (
        <h2>
          Transfers
          <div className="buttons">
            {!!transfers.find(
              transfer => transfer.state === TransferState.INCOMING
            ) && <button onClick={acceptAll}>Accept all</button>}
            {!!transfers.find(
              transfer => transfer.state === TransferState.INCOMING
            ) && <button onClick={rejectAll}>Reject all</button>}
            {!!transfers.find(
              transfer =>
                transfer.state === TransferState.COMPLETE ||
                transfer.state === TransferState.FAILED
            ) && <button onClick={dismissAll}>Dismiss all</button>}
            {!!transfers.find(transfer =>
              cancellableStates.includes(transfer.state)
            ) && <button onClick={cancelAll}>Cancel all</button>}
          </div>
        </h2>
      )}
      <ul className="center queue">
        <AnimatePresence>
          {transfers.map(transfer => (
            <Transfer key={transfer.transferId} transfer={transfer} />
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
};

export default TransferList;
