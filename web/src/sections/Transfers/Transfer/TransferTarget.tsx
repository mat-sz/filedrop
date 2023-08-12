import React from 'react';
import { useTranslation } from 'react-i18not';
import {
  FaTimes,
  FaArrowDown,
  FaArrowUp,
  FaAngleDoubleDown,
  FaCheck,
  FaAngleDoubleUp,
  FaHourglassHalf,
  FaHourglassEnd,
} from 'react-icons/fa/index.js';
import { observer } from 'mobx-react-lite';

import styles from './TransferTarget.module.scss';
import { TransferState } from '../../../types/TransferState.js';
import { Tooltip } from '../../../components/Tooltip.js';
import { TargetTile } from '../../../components/TargetTile.js';
import { Transfer } from '../../../stores/Transfer.js';
import { connection } from '../../../stores/index.js';

interface TransferIconProps {
  transfer: Transfer;
}

const stateIcon = (state: TransferState, receiving: boolean) => {
  switch (state) {
    case TransferState.INCOMING:
      return <FaArrowDown />;
    case TransferState.OUTGOING:
      return <FaArrowUp />;
    case TransferState.FAILED:
      return <FaTimes />;
    case TransferState.IN_PROGRESS:
      if (receiving) {
        return <FaAngleDoubleDown />;
      } else {
        return <FaAngleDoubleUp />;
      }
    case TransferState.CONNECTING:
      return <FaHourglassHalf />;
    case TransferState.CONNECTED:
      return <FaHourglassEnd />;
    case TransferState.COMPLETE:
      return <FaCheck />;
  }
};

export const TransferTarget: React.FC<TransferIconProps> = observer(
  ({ transfer }) => {
    const { t } = useTranslation();
    const targetClient = connection.clientCache.get(transfer.targetId);

    if (!targetClient) {
      return null;
    }

    return (
      <Tooltip content={t(`transferState.${transfer.state}`)}>
        <TargetTile
          className={styles.tile}
          client={targetClient}
          aria-label={t('transfers.icon.state', {
            state: t(`transferState.${transfer.state}`),
          })}
        >
          {stateIcon(transfer.state, transfer.receiving)}
        </TargetTile>
      </Tooltip>
    );
  }
);
