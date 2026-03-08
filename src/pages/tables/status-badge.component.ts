import { Component, Input } from '@angular/core';import { CommonModule } from '@angular/common';import { TableStatus } from './models/table.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="'status-' + status">
      {{ status | titlecase }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 0.25rem;
    }
    .status-blank { background-color: #e5e7eb; color: #374151; }
    :host-context(.dark) .status-blank { background-color: #374151; color: #e5e7eb; }
    .status-running { background-color: #bfdbfe; color: #1e40af; }
    :host-context(.dark) .status-running { background-color: #1e40af; color: #bfdbfe; }
    .status-reserved { background-color: #e9d5ff; color: #6b21a8; }
    :host-context(.dark) .status-reserved { background-color: #6b21a8; color: #e9d5ff; }
  `]
})
export class StatusBadgeComponent {
  @Input() status!: TableStatus;
}
