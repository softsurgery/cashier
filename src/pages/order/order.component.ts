import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { ResponseOrderDto } from '../../types';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OrderService } from './order.service';
import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getOrderDataTableObject } from './utils/order.data-table';
import { OrderRepository } from '@/stores/order-state/order-state.repository';
import { LayoutService } from '@/components/layout/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}
  orderService = inject(OrderService);
  orderRepository = inject(OrderRepository);
  private layoutService = inject(LayoutService);

  data = new BehaviorSubject<ResponseOrderDto[]>([]);
  dataTableObject!: DynamicDataTable<ResponseOrderDto>;

  ngOnInit() {
    this.dataTableObject = getOrderDataTableObject({
      router: this.router,
    });

    this.layoutService.setBreadcrumbs([
      {
        label: 'Orders',
        url: '/orders',
      },
    ]);

    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.layoutService.clearBreadcrumbs();
  }

  loadOrders() {
    this.orderService
      .findAll({
        take: 10,
        skip: 0,
        relations: ['table'],
      })
      .subscribe((orders) => {
        this.data.next(orders);
      });
  }
}
