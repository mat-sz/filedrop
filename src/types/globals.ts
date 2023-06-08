export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      REACT_APP_TITLE: string;
      REACT_APP_SERVER: string;
      REACT_APP_USE_BROWSER_ROUTER: string;
      REACT_APP_ABUSE_EMAIL: string;
    };
  }
}
