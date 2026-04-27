const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControls', {
    minimize: () => ipcRenderer.send('window:minimize'),
    close: () => ipcRenderer.send('window:close'),

    /**
     * 
     * @param {string} newTitle 
     */
    setTitle: (newTitle) => ipcRenderer.send('window:setTitle', newTitle)
});
