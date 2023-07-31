import React from 'react';
import {
  FaFile,
  FaFileAlt,
  FaFileVideo,
  FaFileAudio,
  FaFileImage,
  FaFileArchive,
} from 'react-icons/fa';

import { fileType } from '../../utils/file';
import { TransferModel } from '../../types/Models';
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

const TransferIcon: React.FC<TransferIconProps> = ({ transfer }) => {
  const { t } = useTranslation();

  return (
    <div className="transfer-icon">
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
