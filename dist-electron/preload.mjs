"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  // ...
  ping: (action) => electron.ipcRenderer.send("ping", action)
});
electron.contextBridge.exposeInMainWorld("electron", {
  minimizeWindow: () => electron.ipcRenderer.send("minimize-window"),
  maximizeWindow: () => electron.ipcRenderer.send("maximize-window"),
  closeWindow: () => electron.ipcRenderer.send("close-window")
});
