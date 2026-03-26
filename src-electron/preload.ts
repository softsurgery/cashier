import { contextBridge, ipcRenderer } from 'electron';
import { CreateProductFamilyDto } from './modules/product-family/dtos/create-product-family.dto';
import { CreateProductDto } from './modules/product/dtos/create-product.dto';
import { UpdateProductDto } from './modules/product/dtos/update-product.dto';

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
    findAll: (query?: any) => ipcRenderer.invoke('table:findAll', query),
    findOneById: (id: number) => ipcRenderer.invoke('table:findOneById', id),
    create: (data: { name: string; capacity?: number; status?: string }) =>
      ipcRenderer.invoke('table:create', data),
    update: (id: number, data: Partial<{ name: string; capacity: number; status: string }>) =>
      ipcRenderer.invoke('table:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('table:delete', id),
  },
  // ── TableZone CRUD ──────────────────────────────────────────────
  tableZone: {
    findAll: (query?: any) => ipcRenderer.invoke('table-zone:findAll', query),
    findOneById: (id: number) => ipcRenderer.invoke('table-zone:findOneById', id),
    create: (data: { name: string }) => ipcRenderer.invoke('table-zone:create', data),
    update: (id: number, data: Partial<{ name: string }>) =>
      ipcRenderer.invoke('table-zone:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('table-zone:delete', id),
  },
  // ── Order CRUD ──────────────────────────────────────────────
  order: {
    findAll: (query: any) => ipcRenderer.invoke('order:findAll', query),
    findOneById: (id: number) => ipcRenderer.invoke('order:findOneById', id),
    create: (data: { tableId?: number }) => ipcRenderer.invoke('order:create', data),
    update: (id: number, data: Partial<{ tableId?: number; status: string }>) =>
      ipcRenderer.invoke('order:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('order:delete', id),
    pay: (id: number, amount: number) => ipcRenderer.invoke('order:pay', id, amount),
  },
  // ── ProductFamily CRUD ─────────────────────────────────────
  productFamily: {
    findAll: (query: any) => ipcRenderer.invoke('product-family:findAll', query),
    findOneById: (id: number) => ipcRenderer.invoke('product-family:findOneById', id),
    create: (data: CreateProductFamilyDto) => ipcRenderer.invoke('product-family:create', data),
    update: (id: number, data: Partial<{ name: string; description: string }>) =>
      ipcRenderer.invoke('product-family:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('product-family:delete', id),
  },
  // ── Product CRUD ─────────────────────────────────────
  product: {
    findAll: (query: any) => ipcRenderer.invoke('product:findAll', query),
    findOneById: (id: number) => ipcRenderer.invoke('product:findOneById', id),
    create: (data: CreateProductDto) => ipcRenderer.invoke('product:create', data),
    update: (id: number, data: Partial<UpdateProductDto>) =>
      ipcRenderer.invoke('product:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('product:delete', id),
  },
});
