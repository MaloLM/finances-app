// src/electron.d.ts
declare global {
  interface Window {
    electron: {
      requestData: () => any;
      sendData: (data: any) => void;
      saveTAMForm: (data: any) => void;
      onResponseData: (callback: (event: any, data: any) => void) => void;
      onWriteResponse: (callback: (event: any, response: any) => void) => void;
    };
  }
}

declare module "*.png";
declare module "chart.svg";
declare module "*.jpeg";
declare module "*.jpg";

export { };
