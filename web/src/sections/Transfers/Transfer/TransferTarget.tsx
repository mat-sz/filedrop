import React from 'react';
import { useSelector } from 'react-redux';
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
} from 'react-icons/fa';

import styles from './TransferTarget.module.scss';
import { TransferState } from '../../../types/TransferState';
import { TransferModel } from '../../../types/Models';
import { StateType } from '../../../reducers';
import { Tooltip } from '../../../components/Tooltip';
import { TargetTile } from '../../../components/TargetTile';

interface TransferIconProps {
  transfer: TransferModel;
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

export const TransferTarget: React.FC<TransferIconProps> = ({ transfer }) => {
  const { t } = useTranslation();
  const targetClient = useSelector((state: StateType) =>
    state.clientCache.find(client => client.clientId === transfer.clientId)
  );

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
};
