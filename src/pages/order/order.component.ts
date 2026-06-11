import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { ResponseOrderDto } from '../../types';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OrderService } from './order.service';
import {
  DataTableServerQuery,
  DynamicDataTable,
} from '../../components/datatable-builder/datatable-builder.types';
import { getOrderDataTableObject } from './utils/order.data-table';
import { LayoutService } from '@/components/layout/layout.service';
import { Router } from '@angular/router';
import { createServerQuery } from '@/components/datatable-builder/server-query';
import { buildFindManyQuery } from '@/components/datatable-builder/find-many-query';
import type { FindManyQueryDto } from '../../types';

@Component({
  selector: 'app-order',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private layoutService = inject(LayoutService);

  totalRecords = new BehaviorSubject(0);
  data = new BehaviorSubject<ResponseOrderDto[]>([]);
  dataTableObject!: DynamicDataTable<ResponseOrderDto>;

  serverQuery: DataTableServerQuery = createServerQuery({
    initialPageSize: 10,
    initialSortBy: 'updatedAt',
    initialSortOrder: 'desc',
  });

  constructor(private router: Router) {
    effect(() => {
      this.loadOrders(
        buildFindManyQuery(this.serverQuery, { relations: ['table'] }, this.dataTableObject),
      );
    });
  }

  ngOnInit() {
    this.dataTableObject = getOrderDataTableObject({
      router: this.router,
      serverQuery: this.serverQuery,
    });

    this.layoutService.setBreadcrumbs([
      {
        label: 'Orders',
        url: '/orders',
      },
    ]);
  }

  ngOnDestroy(): void {
    this.layoutService.clearBreadcrumbs();
  }

  loadOrders(query: FindManyQueryDto = {}) {
    this.orderService.findAllPaginated(query).subscribe((response) => {
        this.data.next(response.data);
        this.totalRecords.next(response.meta.itemCount);
      });
  }
}
