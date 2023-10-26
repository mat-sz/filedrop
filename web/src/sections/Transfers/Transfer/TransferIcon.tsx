import React from 'react';
import { useTranslation } from 'react-i18not';
import {
  IoDocument,
  IoDocumentText,
  IoFilm,
  IoMusicalNotes,
  IoImage,
  IoArchive,
} from 'react-icons/io5';

import styles from './TransferIcon.module.scss';
import { fileType } from '../../../utils/file.js';
import { FileType } from '../../../types/FileType.js';
import { Transfer } from '../../../stores/Transfer.js';

interface TransferIconProps {
  transfer: Transfer;
}

const typeIcon = (mime: string) => {
  const type = fileType(mime);

  switch (type) {
    case FileType.ARCHIVE:
      return <IoArchive />;
    case FileType.IMAGE:
      return <IoImage />;
    case FileType.AUDIO:
      return <IoMusicalNotes />;
    case FileType.VIDEO:
      return <IoFilm />;
    case FileType.BINARY:
    case FileType.TEXT:
      return <IoDocumentText />;
    default:
      return <IoDocument />;
  }
};

export const TransferIcon: React.FC<TransferIconProps> = ({ transfer }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.icon}>
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
