const { app, BrowserWindow } = require("electron");
const path = require("path");

const production = (process.env.NODE_ENV === "production");

if (!production) {
  require("electron-reload")(__dirname, { awaitWriteFinish: true });
}

app.on("ready", () => {
  const mainWindow = new BrowserWindow();
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.webContents.openDevTools();
});
