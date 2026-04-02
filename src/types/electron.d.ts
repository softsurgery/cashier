/**
 * Type definitions for the Electron preload API exposed via contextBridge.
 * This allows the Angular app to use `window.electronAPI` with full type safety.
 */

import { CreateOrderDto, ResponseOrderDto, UpdateOrderDto } from './order.types';
import { ResponseProductDto, UpdateProductDto } from './product';
import { CreateProductFamilyDto, ResponseProductFamilyDto } from './product.family';
import { CreateTableDto, ResponseTableDto } from './table.types';
import { ResponseTableZoneDto } from './table-zone.types';
import { StorageFileData, StorageResponse } from '../services/storage.service';

export interface TableAPI {
  findAll(query?: any): Promise<ResponseTableDto[]>;
  findOneById(id: number): Promise<ResponseTableDto | null>;
  create(data: CreateTableDto): Promise<ResponseTableDto>;
  update(
    id: number,
    data: Partial<{ name: string; capacity: number; status: string }>,
  ): Promise<ResponseTableDto | null>;
  delete(id: number): Promise<ResponseTableDto>;
}

export interface TableZoneAPI {
  findAll(query?: any): Promise<ResponseTableZoneDto[]>;
  findOneById(id: number): Promise<ResponseTableZoneDto | null>;
  create(data: { name: string }): Promise<ResponseTableZoneDto>;
  update(id: number, data: Partial<{ name: string }>): Promise<ResponseTableZoneDto | null>;
  delete(id: number): Promise<ResponseTableZoneDto>;
}

export interface OrderAPI {
  findAll(query?: any): Promise<ResponseOrderDto[]>;
  findOneById(id: number): Promise<ResponseOrderDto | null>;
  create(data: CreateOrderDto): Promise<ResponseOrderDto>;
  update(id: number, data: Partial<UpdateOrderDto>): Promise<ResponseOrderDto | null>;
  delete(id: number): Promise<ResponseOrderDto>;
  pay(id: number, amount: number): Promise<ResponseOrderDto>;
}

export interface ProductFamilyAPI {
  findAll(query?: any): Promise<ResponseProductFamilyDto[]>;
  findOneById(id: number): Promise<ResponseProductFamilyDto | null>;
  create(data: CreateProductFamilyDto): Promise<ResponseProductFamilyDto>;
  update(
    id: number,
    data: Partial<UpdateProductFamilyDto>,
  ): Promise<ResponseProductFamilyDto | null>;
  delete(id: number): Promise<ResponseProductFamilyDto>;
}

export interface ProductAPI {
  findAll(query?: any): Promise<ResponseProductDto[]>;
  findOneById(id: number): Promise<ResponseProductDto | null>;
  create(data: CreateProductDto): Promise<ResponseProductDto>;
  update(id: number, data: Partial<UpdateProductDto>): Promise<ResponseProductDto | null>;
  delete(id: number): Promise<ResponseProductDto>;
}

export interface StorageAPI {
  store(file: StorageFileData): Promise<StorageResponse>;
  findOneById(id: number): Promise<StorageResponse>;
  getFilePath(id: number): Promise<string>;
  delete(id: number): Promise<StorageResponse>;
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
  /** Table Zone CRUD operations */
  tableZone: TableZoneAPI;
  /** Order CRUD operations */
  order: OrderAPI;
  /** Product Family CRUD operations */
  productFamily: ProductFamilyAPI;
  /** Product CRUD operations */
  product: ProductAPI;
  /** Storage operations */
  storage: StorageAPI;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
