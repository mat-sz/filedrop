export const stunServer = process.env.REACT_APP_STUN_SERVER || 'stun:stun.1.google.com:19302';
export const turnServer = process.env.REACT_APP_TURN_SERVER || null;
export const wsServer = process.env.REACT_APP_SERVER || 'ws://' + window.location.hostname + ':5000/ws';
export const title = process.env.REACT_APP_TITLE || 'filedrop';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;