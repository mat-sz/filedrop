import React from 'react';
import { useTranslation } from 'react-i18not';
import { AnimatePresence, motion } from 'nanoanim';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './Status.module.scss';
import { animationPropsOpacity } from '../animationSettings';
import { applicationStore } from '../stores/ApplicationStore';

export const Status: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!applicationStore.connected ? (
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
