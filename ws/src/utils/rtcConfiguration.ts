import crypto from 'crypto';

const stunServer = process.env.STUN_SERVER || 'stun:stun1.l.google.com:19302';
const turnMode = process.env.TURN_MODE || 'default';
const turnServer = process.env.TURN_SERVER || null;
const turnUsername = process.env.TURN_USERNAME || null;
const turnCredential = process.env.TURN_CREDENTIAL || null;
const turnSecret = process.env.TURN_SECRET || null;
const turnExpiry = parseInt(process.env.TURN_EXPIRY || '3600');

export const rtcConfiguration = (clientId: string) => {
  const iceServers = [];

  iceServers.push({
    urls: stunServer,
  });

  if (turnServer && turnUsername) {
    if (turnMode === 'hmac' && turnSecret) {
      const timestamp = Math.floor(new Date().getTime() / 1000) + turnExpiry;
      const username = timestamp + ':' + clientId;
      const hmac = crypto.createHmac('sha1', turnSecret);
      hmac.setEncoding('base64');
      hmac.write(username);
      hmac.end();
      iceServers.push({
        urls: turnServer,
        username: username,
        credential: hmac.read(),
      });
    } else if (turnCredential) {
      iceServers.push({
        urls: turnServer,
        username: turnUsername,
        credential: turnCredential,
      });
    }
  }

  return {
    iceServers,
  };
};
