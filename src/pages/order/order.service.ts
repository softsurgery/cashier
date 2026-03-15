import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { CreateOrderDto, ResponseOrderDto, UpdateOrderDto } from '../../types';
import type { FindManyOptions } from 'typeorm';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor() {}

  findAll(query: FindManyOptions<ResponseOrderDto>): Observable<ResponseOrderDto[]> {
    return from(window.electronAPI!.order.findAll(query));
  }

  findOneById(id: number): Observable<ResponseOrderDto | null> {
    return from(window.electronAPI!.order.findOneById(id));
  }

  create(data: CreateOrderDto): Observable<ResponseOrderDto> {
    return from(window.electronAPI!.order.create(data));
  }

  update(id: number, data: Partial<UpdateOrderDto>): Observable<ResponseOrderDto | null> {
    return from(window.electronAPI!.order.update(id, data));
  }

  delete(id: number): Observable<ResponseOrderDto> {
    return from(window.electronAPI!.order.delete(id));
  }

  pay(id: number, amount: number): Observable<ResponseOrderDto> {
    return from(window.electronAPI!.order.pay(id, amount));
  }
}
