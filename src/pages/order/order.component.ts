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
import { OrderRepository } from '@/stores/order-state/order-state.repository';
import { LayoutService } from '@/components/layout/layout.service';
import { Router } from '@angular/router';
import { createServerQuery } from '@/components/datatable-builder/server-query';

@Component({
  selector: 'app-order',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private orderRepository = inject(OrderRepository);
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
      const page = this.serverQuery.page();
      const size = this.serverQuery.pageSize();
      const sortBy = this.serverQuery.sortBy();
      const sortOrder = this.serverQuery.sortOrder();
      const search = this.serverQuery.search();

      this.loadOrders(page, size, search, sortBy, sortOrder);
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

  loadOrders(page = 0, size = 10, search = '', sortBy = '', sortOrder: 'asc' | 'desc' | '' = '') {
    this.orderService
      .findAll({
        take: size,
        skip: page * size,
        order: sortBy
          ? ({
              [sortBy]: sortOrder.toUpperCase(),
            } as Record<string, 'ASC' | 'DESC'>)
          : undefined,
        relations: ['table'],
      })
      .subscribe((orders) => {
        this.data.next(orders);
        this.totalRecords.next(orders.length);
      });
  }
}
