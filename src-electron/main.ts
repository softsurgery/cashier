import 'reflect-metadata';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { initializeDatabase } from './shared/database/database';
import { registerTableHandlers } from './modules/table/ipcs/table.ipc';
import { registerTableZoneHandlers } from './modules/table/ipcs/table-zone.ipc';
import { registerOrderHandlers } from './modules/order/ipcs/order.ipc';
import { registerProductFamilyHandlers } from './modules/product-family/ipcs/product-family.ipc';
import { registerProductHandlers } from './modules/product/ipcs/product.ipc';
import { registerStorageHandlers } from './shared/storage/ipcs/storage.ipc';

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

app.whenReady().then(async () => {
  await initializeDatabase();
  registerTableHandlers();
  registerTableZoneHandlers();
  registerOrderHandlers();
  registerProductFamilyHandlers();
  registerProductHandlers();
  registerStorageHandlers();
  createWindow();
});

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
