import React from 'react';

import styles from './Loading.module.scss';

export const Loading: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className={styles.loading}>{children}</div>;
};
