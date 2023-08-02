import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18not';

import styles from './Actions.module.scss';
import { StateType } from '../../reducers';
import {
  acceptTransferAction,
  cancelTransferAction,
  rejectTransferAction,
  removeTransferAction,
} from '../../actions/transfers';
import { TransferState } from '../../types/TransferState';
import { cancellableStates } from './Transfer';
import { Button } from '../../components/Button';

export const Actions: React.FC = () => {
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

  const hasAcceptable = !!transfers.find(
    transfer => transfer.state === TransferState.INCOMING
  );
  const hasDismissible = !!transfers.find(
    transfer =>
      transfer.state === TransferState.COMPLETE ||
      transfer.state === TransferState.FAILED
  );
  const hasCancellable = !!transfers.find(transfer =>
    cancellableStates.includes(transfer.state)
  );

  return (
    <>
      <div className={styles.actions}>
        {hasAcceptable && (
          <>
            <Button onClick={acceptAll}>
              {t('transfers.actions.acceptAll')}
            </Button>
            <Button onClick={rejectAll}>
              {t('transfers.actions.rejectAll')}
            </Button>
          </>
        )}
        {hasDismissible && (
          <Button onClick={dismissAll}>
            {t('transfers.actions.dismissAll')}
          </Button>
        )}
        {hasCancellable && (
          <Button onClick={cancelAll}>
            {t('transfers.actions.cancelAll')}
          </Button>
        )}
      </div>
    </>
  );
};
