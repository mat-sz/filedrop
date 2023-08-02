import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18not';
import { motion } from 'nanoanim';
import { IoCopy } from 'react-icons/io5';
import clsx from 'clsx';

import styles from './ChatItem.module.scss';
import { animationPropsSlide } from '../../animationSettings';
import { ChatItemModel } from '../../types/Models';
import { StateType } from '../../reducers';
import { copy } from '../../utils/copy';
import { TargetTile } from '../../components/TargetTile';
import { IconButton } from '../../components/IconButton';

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

export const ChatItem: React.FC<ChatItemProps> = ({ item }) => {
  const { t, language } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const client = useSelector((state: StateType) =>
    state.clientCache.find(client => client.clientId === item.clientId)
  );

  useLayoutEffect(() => {
    if (messageRef.current!.offsetHeight < 50) {
      setExpanded(true);
    }
  }, [setExpanded]);

  return (
    <motion.li
      className={clsx('subsection', { [styles.expanded]: expanded })}
      {...animationPropsSlide}
      aria-label="Chat message"
    >
      <div className={styles.info}>
        {client && <TargetTile client={client} />}
        <div>{client?.clientName}</div>
        <div>
          {item.date.toLocaleTimeString(language, { timeStyle: 'short' })}
        </div>
        <IconButton onClick={() => copy(item.message)}>
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
};
