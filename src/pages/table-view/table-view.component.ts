import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { TableZoneService } from '../table-zone/table-zone.service';
import { ResponseOrderDto, ResponseTableDto, ResponseTableZoneDto, TableStatus } from '../../types';
import { LayoutService } from '@/components/layout/layout.service';
import { Router } from '@angular/router';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import {
  findActiveOrder,
  formatAmount,
  getOrderRemaining,
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
} from '../order/utils/order-status.utils';

@Component({
  selector: 'app-zone-tables',
  standalone: true,
  imports: [CommonModule, HlmBadgeImports, HlmCollapsibleImports, NgIcon, HlmIconImports],
  providers: [provideIcons({ lucideChevronDown })],
  templateUrl: './table-view.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex: 1;
        min-height: 0;
        height: 100%;
      }
    `,
  ],
})
export class ZoneTablesComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private service = inject(TableZoneService);
  router = inject(Router);

  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);

  readonly formatAmount = formatAmount;
  readonly getOrderRemaining = getOrderRemaining;
  readonly getOrderStatusLabel = getOrderStatusLabel;

  getActiveOrder(table: ResponseTableDto): ResponseOrderDto | null {
    return findActiveOrder(table.orders);
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Tables', url: '/tables' }]);

    this.service
      .findAll({ relations: ['tables', 'tables.orders'], take: 100, skip: 0 })
      .subscribe((zones) => this.data.next(zones));
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
  }

  getTableBadgeVariant(status: TableStatus) {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'default' as const;
      case TableStatus.OCCUPIED:
        return 'success' as const;
      case TableStatus.RESERVED:
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  }

  getTableStatusLabel(status: TableStatus): string {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'Disponible';
      case TableStatus.OCCUPIED:
        return 'Occupée';
      case TableStatus.RESERVED:
        return 'Réservée';
      default:
        return status;
    }
  }

  getOrderBadgeVariant(status: Parameters<typeof getOrderStatusBadgeVariant>[0]) {
    return getOrderStatusBadgeVariant(status);
  }
}
