const { app, BrowserWindow, screen, systemPreferences } = require("electron");
const path = require("path");

// Set the Screen Access status as environment variable to be read in Svelte
const screenAccessPermission = systemPreferences.getMediaAccessStatus("screen");
process.env.screenAccessPermission = screenAccessPermission;

const production = (process.env.NODE_ENV === "production");

if (!production) {
  require("electron-reload")(__dirname, { awaitWriteFinish: true });
}

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    // set width to match the size of the screen
    width: screen.getPrimaryDisplay().size.width,
    // set height to match the size of the screen
    height: screen.getPrimaryDisplay().size.height,

    frame: false,
    transparent: true,
  });
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
  mainWindow.webContents.openDevTools();
});
