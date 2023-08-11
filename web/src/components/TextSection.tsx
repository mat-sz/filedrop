import React from 'react';

import styles from './TextSection.module.scss';
import { Footer } from './Footer.js';

export const TextSection: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <>
      <div className={styles.text}>{children}</div>
      <Footer />
    </>
  );
};
