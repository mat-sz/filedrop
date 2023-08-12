import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18not';
import { AnimatePresence, motion } from 'nanoanim';
import { ScrollArea } from 'react-nano-scrollbar';
import Textarea from 'react-expanding-textarea';
import { observer } from 'mobx-react-lite';
import { IoSend, IoChatbox, IoGlobe } from 'react-icons/io5/index.js';
import clsx from 'clsx';

import styles from './index.module.scss';
import { animationPropsOpacity } from '../../animationSettings.js';
import { ChatItem } from './ChatItem.js';
import { IconButton } from '../../components/IconButton.js';
import { chatStore } from '../../stores/index.js';
import { TargetTile } from '../../components/TargetTile.js';

const TextareaComponent = Textarea as any;

export const ChatSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const chat = chatStore.items;
  const channels = chatStore.channels;
  const containerRef = useRef<HTMLUListElement | null>(null);

  const [message, setMessage] = useState('');
  const onSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();

    if (!message) {
      return;
    }

    chatStore.sendChatMessage(message);
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
  }, [chat.length]);

  // Disable chat if Web Crypto is not supported.
  if (!chatStore.enabled) {
    return null;
  }

  return (
    <div className={clsx('subsection', 'mobileFlex', styles.chat)}>
      <div className={styles.channels}>
        <ScrollArea horizontal hideScrollbarY>
          <div className={styles.list}>
            <AnimatePresence>
              {channels.map(channel =>
                channel.client ? (
                  <TargetTile
                    className={clsx(styles.channel, {
                      [styles.active]:
                        chatStore.currentChannel === channel.channel,
                    })}
                    variant="small"
                    key={channel.channel}
                    client={channel.client}
                    onClick={() => chatStore.selectChannel(channel.channel)}
                  >
                    {!!channel.unread && (
                      <div className={styles.count}>{channel.unread}</div>
                    )}
                  </TargetTile>
                ) : (
                  <div
                    key={channel.channel}
                    className={clsx(styles.channel, styles.global, {
                      [styles.active]:
                        chatStore.currentChannel === channel.channel,
                    })}
                    onClick={() => chatStore.selectChannel(channel.channel)}
                  >
                    {!!channel.unread && (
                      <div className={styles.count}>{channel.unread}</div>
                    )}
                    <IoGlobe />
                  </div>
                )
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
      <React.Fragment key={chatStore.currentChannel}>
        {chat.length === 0 ? (
          <AnimatePresence>
            <motion.div className={styles.empty} {...animationPropsOpacity}>
              <IoChatbox />
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
      </React.Fragment>
      <form onSubmit={onSubmit}>
        <TextareaComponent
          value={message}
          onKeyDown={onKeyDown}
          onChange={(e: React.ChangeEvent) =>
            setMessage((e.target as any).value)
          }
          placeholder={t('chat.message')}
        />
        <IconButton>
          <IoSend />
        </IconButton>
      </form>
    </div>
  );
});
