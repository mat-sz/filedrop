export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      [key: string]: string;
    };
  }
}
