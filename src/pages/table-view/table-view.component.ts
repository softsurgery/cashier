import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { TableZoneService } from '../table-zone/table-zone.service';
import { TablesService } from '../tables/tables.service';
import { ResponseTableZoneDto, TableStatus } from '../../types';
import { LayoutService } from '@/components/layout/layout.service';
import { Router } from '@angular/router';
import { HlmBadge } from '../../../libs/ui/badge/src/lib/hlm-badge';

@Component({
  selector: 'app-zone-tables',
  standalone: true,
  imports: [CommonModule, HlmBadge],
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class ZoneTablesComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private service = inject(TableZoneService);
  private tableService = inject(TablesService);
  router = inject(Router);

  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);

  statuses = Object.values(TableStatus);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Tables', url: '/tables' }]);

    this.service
      .findAll({ relations: ['tables'], take: 100, skip: 0 })
      .subscribe((zones) => this.data.next(zones));
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
  }

  getBadgeVariant(status: TableStatus) {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'default';
      case TableStatus.OCCUPIED:
        return 'success';
      case TableStatus.RESERVED:
        return 'destructive';
      default:
        return 'default';
    }
  }
}
