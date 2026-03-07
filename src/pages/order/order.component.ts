import { Component, inject, OnInit } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { ResponseOrderDto } from '../../types';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OrderService } from './order.service';
import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getOrderDataTableObject } from './utils/order.data-table';
import { OrderRepository } from '@/stores/order-state/order-state.repository';

@Component({
  selector: 'app-order',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orderService = inject(OrderService);
  orderRepository = inject(OrderRepository);

  data = new BehaviorSubject<ResponseOrderDto[]>([]);

  dataTableObject: DynamicDataTable<ResponseOrderDto> = getOrderDataTableObject({});

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService
      .findAll({
        take: 10,
        skip: 0,
      })
      .subscribe((orders) => {
        this.data.next(orders);
      });
  }
}
