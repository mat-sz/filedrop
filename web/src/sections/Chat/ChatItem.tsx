import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18not';
import { motion } from 'nanoanim';
import { IoCopy } from 'react-icons/io5/index.js';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

import styles from './ChatItem.module.scss';
import { animationPropsSlide } from '../../animationSettings.js';
import { ChatItemModel } from '../../types/Models.js';
import { copy } from '../../utils/copy.js';
import { TargetTile } from '../../components/TargetTile.js';
import { IconButton } from '../../components/IconButton.js';
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
    <motion.li
      className={clsx('subsection', styles.item, {
        [styles.expanded]: expanded,
      })}
      {...animationPropsSlide}
      title="Chat message"
    >
      <div className={styles.info}>
        {client && <TargetTile client={client} />}
        <div>{client?.clientName}</div>
        <div>
          {item.date.toLocaleTimeString(language, { timeStyle: 'short' })}
        </div>
        <IconButton onClick={() => copy(item.message)} title={t('copy')}>
          <IoCopy />
        </IconButton>
      </div>
      <div className={styles.message} ref={messageRef}>
        {urlify(item.message)}
      </div>
      {!expanded && (
        <button className={styles.more} onClick={() => setExpanded(true)}>
          {t('chat.showMore')}
        </button>
      )}
    </motion.li>
  );
});
