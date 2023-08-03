import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18not';

import { StateType } from '../../reducers';
import { Queue } from './Queue';
import { TransferState } from '../../types/TransferState';

export const TransfersSection: React.FC = () => {
  const { t } = useTranslation();
  const transfers = useSelector((store: StateType) => store.transfers);

  const incomingTransfers = transfers.filter(
    transfer => transfer.state === TransferState.INCOMING
  );
  const outgoingTransfers = transfers.filter(
    transfer => transfer.state === TransferState.OUTGOING
  );
  const activeTransfers = transfers.filter(
    transfer =>
      transfer.state === TransferState.CONNECTED ||
      transfer.state === TransferState.CONNECTING ||
      transfer.state === TransferState.IN_PROGRESS
  );
  const completeTransfers = transfers.filter(
    transfer =>
      transfer.state === TransferState.COMPLETE ||
      transfer.state === TransferState.FAILED
  );

  return (
    <>
      <Queue
        transfers={incomingTransfers}
        title={t('transfers.title.incoming')}
      />
      <Queue
        transfers={outgoingTransfers}
        title={t('transfers.title.outgoing')}
      />
      <Queue transfers={activeTransfers} title={t('transfers.title.active')} />
      <Queue
        transfers={completeTransfers}
        title={t('transfers.title.complete')}
      />
    </>
  );
};
