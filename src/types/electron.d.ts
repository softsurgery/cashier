/**
 * Type definitions for the Electron preload API exposed via contextBridge.
 * This allows the Angular app to use `window.electronAPI` with full type safety.
 */

import { CreateOrderDto, ResponseOrderDto, UpdateOrderDto } from './order.types';
import { ResponseTableDto } from './table.types';

export interface TableAPI {
  findAll(query?: any): Promise<ResponseTableDto[]>;
  findOneById(id: number): Promise<ResponseTableDto | null>;
  create(data: { name: string; capacity?: number; status?: string }): Promise<ResponseTableDto>;
  update(
    id: number,
    data: Partial<{ name: string; capacity: number; status: string }>,
  ): Promise<ResponseTableDto | null>;
  delete(id: number): Promise<ResponseTableDto>;
}

export interface OrderAPI {
  findAll(query?: any): Promise<ResponseOrderDto[]>;
  findOneById(id: number): Promise<ResponseOrderDto | null>;
  create(data: CreateOrderDto): Promise<ResponseOrderDto>;
  update(id: number, data: Partial<UpdateOrderDto>): Promise<ResponseOrderDto | null>;
  delete(id: number): Promise<ResponseOrderDto>;
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
  /** Order CRUD operations */
  order: OrderAPI;
  /** Product Family CRUD operations */
  productFamily: ProductFamilyAPI;
  
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
