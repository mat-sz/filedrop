import { BrowserRouter, HashRouter } from 'react-router-dom';

export const wsServer = process.env.REACT_APP_SERVER || 'ws://' + window.location.hostname + ':5000/ws';
export const nameCharacterSet = 'CEFGHJKMNPQRTVWXY';
export const nameLength = 5;
export const Router: any = process.env.REACT_APP_USE_BROWSER_ROUTER ? BrowserRouter : HashRouter;

const stunServer = process.env.REACT_APP_STUN_SERVER || 'stun:stun.1.google.com:19302';
const turnServer = process.env.REACT_APP_TURN_SERVER || null;
const turnUsername = process.env.REACT_APP_TURN_USERNAME || null;
const turnCredential = process.env.REACT_APP_TURN_CREDENTIAL || null;

let iceServers = [];

iceServers.push({
    urls: stunServer,
});

if (turnServer && turnUsername && turnCredential) {
    iceServers.push({
        urls: turnServer,
        username: turnUsername,
        credential: turnCredential,
    });
}

export const rtcConfiguration: RTCConfiguration = {
    iceServers,
};