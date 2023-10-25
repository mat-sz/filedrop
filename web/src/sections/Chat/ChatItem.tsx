import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18not';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './ChatItem.module.scss';
import { ChatItemModel } from '../../types/Models.js';
import { copy } from '../../utils/copy.js';
import { TargetTile } from '../../components/TargetTile.js';
import { CopyButton } from '../../components/CopyButton.js';
import { connection } from '../../stores/index.js';

export interface ChatItemProps {
  item: ChatItemModel;
}

const urlify = (text: string): React.ReactNode => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a href={part} key={i}>
          {part}
        </a>
      );
    }

    return part;
  });
};

export const ChatItem: React.FC<ChatItemProps> = observer(({ item }) => {
  const { t, language } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const client = connection.clientCache.get(item.clientId);

  useLayoutEffect(() => {
    if (messageRef.current!.offsetHeight < 50) {
      setExpanded(true);
    }
  }, [setExpanded]);

  return (
    <li
      className={clsx(styles.item, {
        [styles.expanded]: expanded,
      })}
    >
      <div className={styles.info}>
        {client && <TargetTile client={client} />}
        <div>{client?.clientName}</div>
        <div>
          {item.date.toLocaleTimeString(language, { timeStyle: 'short' })}
        </div>
        <CopyButton onClick={() => copy(item.message)} />
      </div>
      <div className={styles.message} ref={messageRef}>
        {urlify(item.message)}
      </div>
      {!expanded && (
        <button className={styles.more} onClick={() => setExpanded(true)}>
          {t('chat.showMore')}
        </button>
      )}
    </li>
  );
});
