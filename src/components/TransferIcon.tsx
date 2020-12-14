import React from 'react';
import { useSelector } from 'react-redux';
import Tooltip from 'rc-tooltip';
import {
  FaFile,
  FaFileAlt,
  FaFileVideo,
  FaFileAudio,
  FaFileImage,
  FaFileArchive,
  FaTimes,
  FaArrowDown,
  FaArrowUp,
  FaAngleDoubleDown,
  FaCheck,
  FaAngleDoubleUp,
  FaHourglassHalf,
  FaHourglassEnd,
} from 'react-icons/fa';

import { TransferModel } from '../types/Models';
import { StateType } from '../reducers';
import { TransferState } from '../types/TransferState';

const states = {
  [TransferState.INCOMING]: 'Incoming',
  [TransferState.OUTGOING]: 'Outgoing',
  [TransferState.CONNECTING]: 'Connecting...',
  [TransferState.CONNECTED]: 'Connected!',
  [TransferState.IN_PROGRESS]: 'In progress...',
  [TransferState.COMPLETE]: 'Complete!',
  [TransferState.FAILED]: 'Failed!',
};

interface TransferIconProps {
  transfer: TransferModel;
}

const TransferIcon: React.FC<TransferIconProps> = ({ transfer }) => {
  const network = useSelector((state: StateType) => state.network);
  const targetClient = network.find(
    client => client.clientId === transfer.clientId
  );

  const typeIcon = (type: string) => {
    if (type.startsWith('text/') || type.includes('pdf')) {
      return <FaFileAlt />;
    } else if (
      type.includes('zip') ||
      type.includes('rar') ||
      type.includes('7z') ||
      type.includes('compress')
    ) {
      return <FaFileArchive />;
    } else if (type.startsWith('image/')) {
      return <FaFileImage />;
    } else if (type.startsWith('video/')) {
      return <FaFileVideo />;
    } else if (type.startsWith('audio/')) {
      return <FaFileAudio />;
    } else if (type.startsWith('application/')) {
      return <FaFileAlt />;
    } else {
      return <FaFile />;
    }
  };

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

  return (
    <div className="transfer-icon">
      {targetClient ? (
        <Tooltip
          placement="top"
          overlay={states[transfer.state]}
          transitionName="rc-tooltip-fade"
        >
          <div
            className="network-tile target-tile"
            style={{
              backgroundColor: targetClient.clientColor,
            }}
            aria-label={'Transfer state: ' + states[transfer.state]}
          >
            {stateIcon(transfer.state, transfer.receiving)}
          </div>
        </Tooltip>
      ) : null}
      {transfer.preview ? (
        <img src={transfer.preview} alt={'Preview: ' + transfer.fileName} />
      ) : (
        typeIcon(transfer.fileType)
      )}
    </div>
  );
};

export default TransferIcon;
