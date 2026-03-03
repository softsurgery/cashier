import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  /** Returns platform info from the main process */
  getPlatform: (): string => process.platform,

  /** Returns the Electron version */
  getElectronVersion: (): string => process.versions.electron,

  /** Returns the Node.js version */
  getNodeVersion: (): string => process.versions.node,

  /** Returns the Chrome version */
  getChromeVersion: (): string => process.versions.chrome,

  /** Send a ping and get a pong from main process */
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),

  // ── Table CRUD ──────────────────────────────────────────────
  table: {
    getAll: () => ipcRenderer.invoke('table:getAll'),
    getById: (id: number) => ipcRenderer.invoke('table:getById', id),
    create: (data: { name: string; capacity?: number; status?: string }) =>
      ipcRenderer.invoke('table:create', data),
    update: (id: number, data: Partial<{ name: string; capacity: number; status: string }>) =>
      ipcRenderer.invoke('table:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('table:delete', id),
  },
});
