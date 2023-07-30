import dotenv from 'dotenv-flow';
dotenv.config();

export const useProxy = process.env.WS_USE_PROXY === '1';
export const host = process.env.WS_HOST || '127.0.0.1';
export const port = parseInt(process.env.WS_PORT || '5000');
export const appName = process.env.WS_APP_NAME || undefined;
