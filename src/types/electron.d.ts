/**
 * Type definitions for the Electron preload API exposed via contextBridge.
 * This allows the Angular app to use `window.electronAPI` with full type safety.
 */
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
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
