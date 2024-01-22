// src/electron.d.ts
declare global {
  interface Window {
    electron: {
      requestData: () => any;
      sendData: (data: any) => void;
      onResponseData: (callback: (event: any, data: any) => void) => void;
      onWriteResponse: (callback: (event: any, response: any) => void) => void;
    };
  }
}
export { };
