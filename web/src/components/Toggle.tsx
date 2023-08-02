import React from 'react';

import styles from './Toggle.module.scss';

interface ToggleProps {
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ label, value, onChange }) => {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        className={styles.input}
        checked={value}
        onChange={e => onChange?.(e.target.checked)}
      />
      <span className={styles.track}>
        <span className={styles.indicator}>
          <span className={styles.checkmark}>
            <svg
              viewBox="0 0 24 24"
              id="ghq-svg-check"
              role="presentation"
              aria-hidden="true"
            >
              <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
            </svg>
          </span>
        </span>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
};
