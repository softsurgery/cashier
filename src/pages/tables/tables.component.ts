import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablesService } from './tables.service';
import type { TableRecord } from '../../types/electron';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { provideIcons } from '@ng-icons/core';
import { lucidePlus, lucidePencil, lucideTrash2, lucideLoader } from '@ng-icons/lucide';

@Component({
  selector: 'app-tables',
  imports: [
    FormsModule,
    ...HlmButtonImports,
    ...HlmInputImports,
    ...HlmSeparatorImports,
    ...HlmIconImports,
  ],
  providers: [provideIcons({ lucidePlus, lucidePencil, lucideTrash2, lucideLoader })],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
  private readonly tablesService = inject(TablesService);

  readonly tables = this.tablesService.tables;
  readonly loading = this.tablesService.loading;
  readonly error = this.tablesService.error;

  // Form state
  readonly showForm = signal(false);
  readonly editingTable = signal<TableRecord | null>(null);
  formName = '';
  formStatus = 'available';

  ngOnInit(): void {
    this.tablesService.loadAll();
  }

  openCreateForm(): void {
    this.editingTable.set(null);
    this.formName = '';
    this.formStatus = 'available';
    this.showForm.set(true);
  }

  openEditForm(table: TableRecord): void {
    this.editingTable.set(table);
    this.formName = table.name;
    this.formStatus = table.status;
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingTable.set(null);
  }

  async submitForm(): Promise<void> {
    const editing = this.editingTable();
    if (editing) {
      await this.tablesService.update(editing.id, {
        name: this.formName,
        status: this.formStatus,
      });
    } else {
      await this.tablesService.create({
        name: this.formName,
        status: this.formStatus,
      });
    }
    this.showForm.set(false);
    this.editingTable.set(null);
  }

  async deleteTable(id: number): Promise<void> {
    await this.tablesService.delete(id);
  }

  statusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'occupied':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  }
}
