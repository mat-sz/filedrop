import React from 'react';
import { useTranslation } from 'react-i18not';
import { AnimatePresence, motion } from 'nanoanim';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './Status.module.scss';
import { animationPropsOpacity } from '../animationSettings.js';
import { connection } from '../stores/index.js';

export const Status: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!connection.connected && !connection.disconnectReason ? (
        <motion.div
          {...animationPropsOpacity}
          className={clsx(styles.status, styles.error)}
        >
          <div>{t('state.connecting')}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});
