const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function getFirstRunStatePath() {
  return path.join(app.getPath('userData'), 'first-run-state.json');
}

function hasAcknowledgedFirstRun() {
  try {
    const statePath = getFirstRunStatePath();

    if (!fs.existsSync(statePath)) {
      return false;
    }

    const rawState = fs.readFileSync(statePath, 'utf8');
    const parsedState = JSON.parse(rawState);

    return parsedState?.acknowledged === true;
  } catch {
    return false;
  }
}

function persistFirstRunAcknowledgement() {
  const statePath = getFirstRunStatePath();
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify({ acknowledged: true }, null, 2), 'utf8');
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 320,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

ipcMain.on('window:minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.minimize();
});

ipcMain.on('window:close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.on("window:setTitle",
  /**
   * 
   * @param {import('electron/main').IpcMainEvent} ev 
   * @param {string} newTitle 
   */
  (event, newTitle) => {
    const window = BrowserWindow.fromWebContents(event.sender);

    if (typeof newTitle !== 'string') {
      return;
    }

    window?.setTitle(newTitle);
  });

ipcMain.handle('app:get-first-run-state', () => {
  return {
    acknowledged: hasAcknowledgedFirstRun(),
  };
});

ipcMain.handle('app:acknowledge-first-run', () => {
  persistFirstRunAcknowledgement();
  return {
    acknowledged: true,
  };
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
