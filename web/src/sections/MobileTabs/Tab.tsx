import React from 'react';
import clsx from 'clsx';

import styles from './Tab.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../../reducers';
import { setTabAction } from '../../actions/state';

interface Props {
  id: string;
}

export const Tab: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  children,
}) => {
  const isActive = useSelector((state: StateType) => state.tab === id);
  const dispatch = useDispatch();

  return (
    <button
      className={clsx(styles.tab, { [styles.active]: isActive })}
      onClick={() => dispatch(setTabAction(id))}
      role="tab"
    >
      {children}
    </button>
  );
};
