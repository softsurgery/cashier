/**
 * Type definitions for the Electron preload API exposed via contextBridge.
 * This allows the Angular app to use `window.electronAPI` with full type safety.
 */

export interface TableRecord {
  id: number;
  name: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  createdAt: string;
  updatedAt: string;
}

export interface TableAPI {
  getAll(): Promise<TableRecord[]>;
  getById(id: number): Promise<TableRecord | null>;
  create(data: { name: string; capacity?: number; status?: string }): Promise<TableRecord>;
  update(
    id: number,
    data: Partial<{ name: string; capacity: number; status: string }>,
  ): Promise<TableRecord | null>;
  delete(id: number): Promise<boolean>;
}

export interface ElectronAPI {
  /** Returns the OS platform (e.g., 'linux', 'win32', 'darwin') */
  getPlatform(): string;
  /** Returns the Electron version */
  getElectronVersion(): string;
  /** Returns the Node.js version */
  getNodeVersion(): string;
  /** Returns the Chrome version */
  getChromeVersion(): string;
  /** Send a ping and get a pong from main process */
  ping(): Promise<string>;
  /** Table CRUD operations */
  table: TableAPI;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
