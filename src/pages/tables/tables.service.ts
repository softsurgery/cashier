import { Injectable, signal, computed } from '@angular/core';
import type { TableRecord } from '../../types/electron';

@Injectable({ providedIn: 'root' })
export class TablesService {
  private readonly _tables = signal<TableRecord[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly tables = this._tables.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._tables().length);

  private get api() {
    return window.electronAPI?.table;
  }

  async loadAll(): Promise<void> {
    if (!this.api) return;
    this._loading.set(true);
    this._error.set(null);
    try {
      const tables = await this.api.getAll();
      this._tables.set(tables);
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to load tables');
    } finally {
      this._loading.set(false);
    }
  }

  async getById(id: number): Promise<TableRecord | null> {
    if (!this.api) return null;
    return this.api.getById(id);
  }

  async create(data: { name: string; status?: string }): Promise<TableRecord | null> {
    if (!this.api) return null;
    this._error.set(null);
    try {
      const created = await this.api.create(data);
      await this.loadAll();
      return created;
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to create table');
      return null;
    }
  }

  async update(
    id: number,
    data: Partial<{ name: string; capacity: number; status: string }>,
  ): Promise<TableRecord | null> {
    if (!this.api) return null;
    this._error.set(null);
    try {
      const updated = await this.api.update(id, data);
      await this.loadAll();
      return updated;
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to update table');
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    if (!this.api) return false;
    this._error.set(null);
    try {
      const result = await this.api.delete(id);
      if (result) await this.loadAll();
      return result;
    } catch (e) {
      this._error.set(e instanceof Error ? e.message : 'Failed to delete table');
      return false;
    }
  }
}
