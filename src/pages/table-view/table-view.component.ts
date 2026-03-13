import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { TableZoneService } from '../table-zone/table-zone.service';
import { TablesService } from '../tables/tables.service';
import { ResponseTableZoneDto, TableStatus, ResponseTableDto } from '../../types';
import { LayoutService } from '@/components/layout/layout.service';

@Component({
  selector: 'app-zone-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class ZoneTablesComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);

  private service = inject(TableZoneService);
  private tableService = inject(TablesService);
  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);

  statuses: string[] = [];
  statusBgColors: Record<string, string> = {};

  constructor() {
    this.statuses = Object.values(TableStatus);

    this.statusBgColors = {
      available: 'bg-gray-200',
      occupied: 'bg-green-200',
      reserved: 'bg-purple-200',
    };
  }

  changeStatus(table: ResponseTableDto, status: string) {
    if (table.status === status) {
      return;
    }
    this.tableService.update(table.id, { status: status as TableStatus }).subscribe({
      next: (updated) => {
        if (!updated) {
          return;
        }
        table.status = updated.status;
        const zones = this.data.value;
        this.data.next([...zones]);
      },
      error: (err) => console.error('failed to update status', err),
    });
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Tables',
        url: '/tables',
      },
    ]);
    this.service
      .findAll({ relations: ['tables'], take: 100, skip: 0 })
      .subscribe((zones) => this.data.next(zones));
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
  }
}
