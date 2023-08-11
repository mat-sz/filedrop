import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import styles from './index.module.scss';
import { applicationStore } from '../../stores/index.js';

export const NoticeSection: React.FC = observer(() => {
  const { noticeText, noticeUrl } = applicationStore;

  if (!noticeText) {
    return null;
  }

  return (
    <div className={clsx('subsection', styles.notice)}>
      {noticeUrl ? <a href={noticeUrl}>{noticeText}</a> : noticeText}
    </div>
  );
});
