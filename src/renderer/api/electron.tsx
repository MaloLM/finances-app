export function useIpcRenderer() {
    const sendRequestData = () => {
      window.electron.requestData();
    };
  
    const sendWriteData = (data: any) => {
      window.electron.sendData(data);
    };
  
    const onResponseData = (callback: (event: any, data: any) => void) => {
      window.electron.onResponseData(callback);
    };
  
    const onWriteResponse = (callback: (event: any, response: any) => void) => {
      window.electron.onWriteResponse(callback);
    };
  
    return { sendRequestData, sendWriteData, onResponseData, onWriteResponse };
  }