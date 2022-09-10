import React from 'react';
import { useSelector } from 'react-redux';
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

import { uuidToColor } from '../../utils/color';
import { fileType } from '../../utils/file';
import { TransferState } from '../../types/TransferState';
import { TransferModel } from '../../types/Models';
import { StateType } from '../../reducers';
import Tooltip from '../../components/Tooltip';
import { FileType } from '../../types/FileType';
import { useTranslation } from 'react-i18next';

interface TransferIconProps {
  transfer: TransferModel;
}

const typeIcon = (mime: string) => {
  const type = fileType(mime);

  switch (type) {
    case FileType.ARCHIVE:
      return <FaFileArchive />;
    case FileType.IMAGE:
      return <FaFileImage />;
    case FileType.AUDIO:
      return <FaFileAudio />;
    case FileType.VIDEO:
      return <FaFileVideo />;
    case FileType.BINARY:
      return <FaFileAlt />;
    case FileType.TEXT:
      return <FaFileAlt />;
    default:
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

const TransferIcon: React.FC<TransferIconProps> = ({ transfer }) => {
  const { t } = useTranslation();
  const targetClient = useSelector((state: StateType) =>
    state.network.find(client => client.clientId === transfer.clientId)
  );

  return (
    <div className="transfer-icon">
      {targetClient ? (
        <Tooltip content={t(`transferState.${transfer.state}`)}>
          <div
            className="network-tile target-tile"
            style={{
              backgroundColor: uuidToColor(targetClient.clientId),
            }}
            aria-label={t('transfers.icon.state', {
              state: t(`transferState.${transfer.state}`),
            })}
          >
            {stateIcon(transfer.state, transfer.receiving)}
          </div>
        </Tooltip>
      ) : null}
      {transfer.preview ? (
        <img
          src={transfer.preview}
          alt={t('transfers.icon.preview', { fileName: transfer.fileName })}
        />
      ) : (
        typeIcon(transfer.fileType)
      )}
    </div>
  );
};

export default TransferIcon;
