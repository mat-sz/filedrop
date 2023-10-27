import 'dotenv-flow';

export const useProxy = process.env.WS_USE_PROXY === '1';
export const requireCrypto = process.env.WS_REQUIRE_CRYPTO === '1';
export const host = process.env.WS_HOST || '127.0.0.1';
export const port = parseInt(process.env.WS_PORT || '5000');
export const appName = process.env.WS_APP_NAME || undefined;
export const abuseEmail = process.env.WS_ABUSE_EMAIL || undefined;
export const staticRoot = process.env.WS_STATIC_ROOT || '../web/build';

export const maxClientNameLength = 32;
export const maxSize = parseInt(process.env.WS_MAX_SIZE || '65536');
export const maxNetworkClients = parseInt(
  process.env.WS_MAX_NETWORK_CLIENTS || '64'
);
export const noticeText = process.env.NOTICE_TEXT;
export const noticeUrl = process.env.NOTICE_URL;

export const acceptForwardedFor = process.env.WS_USE_X_FORWARDED_FOR === '1';

export const stunServer =
  process.env.STUN_SERVER || 'stun:stun1.l.google.com:19302';
export const turnMode = process.env.TURN_MODE || 'default';
export const turnServer = process.env.TURN_SERVER || null;
export const turnUsername = process.env.TURN_USERNAME || null;
export const turnCredential = process.env.TURN_CREDENTIAL || null;
export const turnSecret = process.env.TURN_SECRET || null;
export const turnExpiry = parseInt(process.env.TURN_EXPIRY || '3600');
