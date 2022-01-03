const { app, BrowserWindow } = require("electron");
const path = require("path");

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

app.on("ready", () => {
  const mainWindow = new BrowserWindow();
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.webContents.openDevTools();
});
