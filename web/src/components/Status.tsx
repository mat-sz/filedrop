import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from '../animate';
import clsx from 'clsx';

import styles from './Status.module.scss';
import { StateType } from '../reducers';
import { animationPropsOpacity } from '../animationSettings';

export const Status: React.FC = () => {
  const connected = useSelector((state: StateType) => state.connected);
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!connected ? (
        <motion.div
          {...animationPropsOpacity}
          className={clsx(styles.status, styles.error)}
        >
          <div>{t('state.connecting')}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
