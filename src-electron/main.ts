import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

// IPC Handlers
ipcMain.handle('ping', () => 'pong');

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!app.isPackaged) {
    // DEV → Load Angular dev server
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    // PROD → Load built files
    win.loadFile(path.join(__dirname, '..', 'dist', 'cashier', 'browser', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
