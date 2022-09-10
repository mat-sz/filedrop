import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';

import { StateType } from '../../reducers';
import {
  acceptTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  removeTransferAction,
} from '../../actions/transfers';
import { TransferState } from '../../types/TransferState';
import Transfer, { cancellableStates } from './Transfer';

const TransferList: React.FC = () => {
  const { t } = useTranslation();
  const transfers = useSelector((store: StateType) => store.transfers);
  const dispatch = useDispatch();

  const acceptAll = () => {
    transfers
      .filter(transfer => transfer.state === TransferState.INCOMING)
      .forEach(transfer => dispatch(acceptTransferAction(transfer.transferId)));
  };
  const rejectAll = () => {
    transfers
      .filter(transfer => transfer.state === TransferState.INCOMING)
      .forEach(transfer => dispatch(rejectTransferAction(transfer.transferId)));
  };
  const cancelAll = () => {
    transfers
      .filter(transfer => cancellableStates.includes(transfer.state))
      .forEach(transfer => dispatch(cancelTransferAction(transfer.transferId)));
  };
  const dismissAll = () => {
    transfers
      .filter(
        transfer =>
          transfer.state === TransferState.COMPLETE ||
          transfer.state === TransferState.FAILED
      )
      .forEach(transfer => dispatch(removeTransferAction(transfer.transferId)));
  };

  return (
    <>
      {transfers.length !== 0 && (
        <h2>
          {t('transfers.title')}
          <div className="actions">
            {!!transfers.find(
              transfer => transfer.state === TransferState.INCOMING
            ) && (
              <button onClick={acceptAll}>
                {t('transfers.actions.acceptAll')}
              </button>
            )}
            {!!transfers.find(
              transfer => transfer.state === TransferState.INCOMING
            ) && (
              <button onClick={rejectAll}>
                {t('transfers.actions.rejectAll')}
              </button>
            )}
            {!!transfers.find(
              transfer =>
                transfer.state === TransferState.COMPLETE ||
                transfer.state === TransferState.FAILED
            ) && (
              <button onClick={dismissAll}>
                {t('transfers.actions.dismissAll')}
              </button>
            )}
            {!!transfers.find(transfer =>
              cancellableStates.includes(transfer.state)
            ) && (
              <button onClick={cancelAll}>
                {t('transfers.actions.cancelAll')}
              </button>
            )}
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
