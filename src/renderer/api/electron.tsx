// export function useIpcRenderer() {
//     const sendRequestData = () => {
//       window.electron.requestData();
//     };
//     const sendWriteData = (data: any) => {
//       window.electron.sendData(data);
//     };

//     const onResponseData = (callback: (event: any, data: any) => void) => {
//       window.electron.onResponseData(callback);
//     };

//     const onWriteResponse = (callback: (event: any, response: any) => void) => {
//       window.electron.onWriteResponse(callback);
//     };

//       const saveFormData = (data: any) => {
//         window.electron.saveTAMForm(data);
//       }

//     return { sendRequestData, sendWriteData, onResponseData, onWriteResponse, saveFormData };
//   }

import { ipcRenderer } from 'electron'

export function useIpcRenderer() {
    const sendRequestData = () => {
        ipcRenderer.send('request-data-channel')
    }

    const sendWriteData = (data: any) => {
        ipcRenderer.send('write-data-channel', data)
    }

    const onResponseData = (callback: (event: any, data: any) => void) => {
        ipcRenderer.on('response-data-channel', callback)
    }

    const onWriteResponse = (callback: (event: any, response: any) => void) => {
        ipcRenderer.on('write-response-channel', callback)
    }

    const saveFormData = (data: any) => {
        ipcRenderer.send('update-tam-config', data)
    }

    return { sendRequestData, sendWriteData, onResponseData, onWriteResponse, saveFormData }
}
