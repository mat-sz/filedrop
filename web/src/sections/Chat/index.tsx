import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from '../../animate';
import { ScrollArea } from 'react-nano-scrollbar';
import Textarea from 'react-expanding-textarea';
import { FaPaperPlane, FaRegCommentDots } from 'react-icons/fa';
import clsx from 'clsx';

import styles from './index.module.scss';
import { StateType } from '../../reducers';
import { sendChatMessageAction } from '../../actions/state';
import { animationPropsOpacity } from '../../animationSettings';
import { ChatItem } from './ChatItem';
import { IconButton } from '../../components/IconButton';

export const ChatSection: React.FC = () => {
  const { t } = useTranslation();
  const chat = useSelector((store: StateType) => store.chat);
  const privateKey = useSelector((store: StateType) => store.privateKey);
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLUListElement | null>(null);

  const [message, setMessage] = useState('');
  const onSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    dispatch(sendChatMessageAction(message));
    setMessage('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSubmit(e);
    }
  };

  useEffect(() => {
    const lastElement = containerRef.current?.lastElementChild;
    if (lastElement) {
      lastElement.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'start',
      });
    }
  }, [chat]);

  // Disable chat if Web Crypto is not supported.
  if (!privateKey) {
    return null;
  }

  return (
    <div className={clsx('subsection', styles.chat)}>
      {chat.length === 0 ? (
        <AnimatePresence>
          <motion.div className={styles.empty} {...animationPropsOpacity}>
            <FaRegCommentDots />
            <h3>{t('emptyChat.title')}</h3>
            <div>{t('emptyChat.body')}</div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <ScrollArea hideScrollbarX className={styles.items}>
          <ul ref={containerRef}>
            <AnimatePresence>
              {chat.map(item => (
                <ChatItem key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </ul>
        </ScrollArea>
      )}
      <form onSubmit={onSubmit}>
        <Textarea
          value={message}
          onKeyDown={onKeyDown}
          onChange={e => setMessage((e.target as any).value)}
          placeholder={t('chat.message')}
        />
        <IconButton>
          <FaPaperPlane />
        </IconButton>
      </form>
    </div>
  );
};
