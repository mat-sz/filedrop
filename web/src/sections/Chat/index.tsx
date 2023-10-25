import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18not';
import Textarea from 'react-expanding-textarea';
import { observer } from 'mobx-react-lite';
import { IoSend, IoChatbox, IoGlobe, IoClipboard } from 'react-icons/io5';
import clsx from 'clsx';

import styles from './index.module.scss';
import { ChatItem } from './ChatItem.js';
import { IconButton } from '../../components/IconButton.js';
import { applicationStore, chatStore } from '../../stores/index.js';
import { TargetTile } from '../../components/TargetTile.js';
import { NotificationCount } from '../../components/NotificationCount.js';

export const ChatSection: React.FC = observer(() => {
  const { t } = useTranslation();
  const chat = chatStore.items;
  const channels = chatStore.channels;
  const containerRef = useRef<HTMLUListElement | null>(null);

  const tab = applicationStore.tab;
  useEffect(() => {
    chatStore.setVisible(applicationStore.tab === 'chat');
  }, [tab]);

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

  return (
    <div className={clsx('subsection', 'mobileFlex', styles.chat)}>
      <div className={styles.channels}>
        <div className={styles.list}>
          {channels.map(channel =>
            channel.client ? (
              <TargetTile
                className={clsx(styles.channel, {
                  [styles.active]: chatStore.currentChannel === channel.channel,
                })}
                variant="small"
                key={channel.channel}
                client={channel.client}
                onClick={() => chatStore.selectChannel(channel.channel)}
              >
                <NotificationCount count={channel.unread} />
              </TargetTile>
            ) : (
              <div
                key={channel.channel}
                className={clsx(styles.channel, styles.global, {
                  [styles.active]: chatStore.currentChannel === channel.channel,
                })}
                onClick={() => chatStore.selectChannel(channel.channel)}
              >
                <NotificationCount count={channel.unread} />
                <IoGlobe />
              </div>
            )
          )}
        </div>
      </div>
      <React.Fragment key={chatStore.currentChannel}>
        {chat.length === 0 ? (
          <div className={styles.empty}>
            <IoChatbox />
            <div className={styles.title}>{t('emptyChat.title')}</div>
            <div>
              {chatStore.currentChannel === 'global'
                ? t('emptyChat.body')
                : t('emptyChat.bodyTarget', {
                    target: chatStore.currentChannelName,
                  })}
            </div>
          </div>
        ) : (
          <div className={styles.items}>
            <div className={styles.placeholder} />
            <ul ref={containerRef}>
              {chat.map(item => (
                <ChatItem key={item.id} item={item} />
              ))}
            </ul>
          </div>
        )}
      </React.Fragment>
      <form onSubmit={onSubmit}>
        <Textarea
          value={message}
          onKeyDown={onKeyDown}
          onChange={(e: React.ChangeEvent) =>
            setMessage((e.target as any).value)
          }
          placeholder={t('chat.message', {
            target: chatStore.currentChannelName,
          })}
        />
        {applicationStore.showPaste && (
          <IconButton
            title={t('paste')}
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (text) {
                  chatStore.sendChatMessage(text);
                }
              } catch {}
            }}
          >
            <IoClipboard />
          </IconButton>
        )}
        <IconButton title={t('send')}>
          <IoSend />
        </IconButton>
      </form>
    </div>
  );
});
