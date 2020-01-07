import { MiddlewareAPI } from "redux";
import { ActionType } from "./types/ActionType";

export class BetterWebSocket {
    onConnected?: () => void;
    onDisconnected?: () => void;
    onMessage?: (message: any) => void;
    private socket: WebSocket = null;
    private retries = 0;

    constructor(private url: string) {
        this.connect();
    }

    connect() {
        this.retries++;

        if (this.retries > 5) {
            this.disconnected();
            return;
        }

        if (this.socket) {
            try {
                this.socket.close();
                this.disconnected();
            } catch { }
        }

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            this.connected();
        };

        this.socket.onclose = (e) => {
            this.disconnected();
            this.socket = null;

            if (e.code === 1000) {
                setTimeout(() => {
                    this.connect();
                }, 500);
            }
        };

        this.socket.onmessage = (e) => {
            this.message(e.data);
        };

        this.socket.onerror = () => {
            this.disconnected();
            this.socket = null;

            setTimeout(() => {
                this.connect();
            }, 500);
        };
    }

    send(data: any) {
        if (!this.socket) return;

        this.socket.send(JSON.stringify(data));
    }

    get readyState() {
        return this.socket.readyState;
    }

    private connected() {
        this.retries = 0;

        if (this.onConnected) {
            this.onConnected();
        }
    }

    private disconnected() {
        if (this.onDisconnected) {
            this.onDisconnected();
        }
    }

    private message(data: string) {
        try {
            const json = JSON.parse(data);
            if (json && this.onMessage) {
                this.onMessage(json);
            }
        } catch { }
    }
};

export const socketMiddleware = (url: string) => {
    return (store: MiddlewareAPI<any, any>) => {
        const socket = new BetterWebSocket(url);
        
        socket.onConnected = () => store.dispatch({ type: ActionType.WS_CONNECTED });
        socket.onDisconnected = () => store.dispatch({ type: ActionType.WS_DISCONNECTED });
        socket.onMessage = (message) => store.dispatch({ type: ActionType.WS_MESSAGE, value: message });

        return (next: (action: any) => void) => (action: any) => {
            if (action.type && action.type === ActionType.WS_SEND_MESSAGE && socket.readyState === 1) {
                socket.send(action.value);
            }
            
            return next(action);
        };
    };
};