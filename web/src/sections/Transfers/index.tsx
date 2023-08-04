import React from 'react';
import { useTranslation } from 'react-i18not';

import { Queue } from './Queue';
import { TransferState } from '../../types/TransferState';
import { observer } from 'mobx-react-lite';
import { applicationStore } from '../../stores/ApplicationStore';

export const TransfersSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const transfers = applicationStore.networkStore.transfers;

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
});
