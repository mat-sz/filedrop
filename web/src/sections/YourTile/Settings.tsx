import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Settings.module.scss';
import { Toggle } from '../../components/Toggle';
import { StateType } from '../../reducers';
import { setAutoAcceptAction } from '../../actions/state';

export const Settings: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const autoAccept = useSelector((state: StateType) => state.autoAccept);

  return (
    <div className={styles.settings}>
      <Toggle
        label={t('settings.autoAccept')}
        value={autoAccept}
        onChange={value => dispatch(setAutoAcceptAction(value))}
      />
    </div>
  );
};
