const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  requestData: () => ipcRenderer.send('request-data-channel'),
  sendData: (data) => ipcRenderer.send('write-data-channel', data),
  onResponseData: (callback) => ipcRenderer.on('response-data-channel', callback),
  onWriteResponse: (callback) => ipcRenderer.on('write-response-channel', callback)
});
