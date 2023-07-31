import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import styles from './Notice.module.scss';
import { StateType } from '../../reducers';

export const Notice: React.FC = () => {
  const noticeText = useSelector((store: StateType) => store.noticeText);
  const noticeUrl = useSelector((store: StateType) => store.noticeUrl);

  if (!noticeText) {
    return null;
  }

  return (
    <div className={clsx('subsection', styles.notice)}>
      {noticeUrl ? <a href={noticeUrl}>{noticeText}</a> : noticeText}
    </div>
  );
};
