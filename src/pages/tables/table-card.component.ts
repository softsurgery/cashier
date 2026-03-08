import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Table, TableStatus } from './models/table.model';

@Component({
  selector: 'app-table-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './table-card.component.html',
})
export class TableCardComponent {
  @Input() table!: Table;
  @Output() edit = new EventEmitter<Table>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ id: string; status: TableStatus }>();

  statuses: TableStatus[] = ['blank', 'running', 'reserved'];

  onEdit() {
    this.edit.emit(this.table);
  }
  onDelete() {
    this.delete.emit(this.table.id);
  }

  changeStatus(status: TableStatus) {
    if (this.table.status !== status) {
      this.statusChange.emit({ id: this.table.id, status });
    }
  }

  get statusClass(): object {
    const styles: Record<TableStatus, object> = {
      blank: {
        'background-color': 'var(--status-blank-bg, #f3f4f6)',
        'border-left': '4px solid #9ca3af',
      },
      running: {
        'background-color': 'var(--status-running-bg, #dbeafe)',
        'border-left': '4px solid #3b82f6',
      },
      reserved: {
        'background-color': 'var(--status-reserved-bg, #f3e8ff)',
        'border-left': '4px solid #a855f7',
      },
    };
    return styles[this.table.status] ?? {};
  }

  getStatusBtnClass(s: TableStatus): string {
    const base =
      'px-2 py-1 rounded text-xs font-semibold cursor-pointer border-0 transition-opacity';
    const active = this.table.status === s ? 'ring-2 ring-current font-extrabold' : '';
    const colors: Record<TableStatus, string> = {
      blank: 'bg-gray-200 text-gray-700',
      running: 'bg-blue-200 text-blue-800',
      reserved: 'bg-purple-200 text-purple-800',
    };
    return `${base} ${colors[s]} ${active}`;
  }
}
