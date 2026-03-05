import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ResponseOrderDto } from '../../types';
import type { FindManyOptions } from 'typeorm';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor() {}

  findAll(query: FindManyOptions<ResponseOrderDto>): Observable<ResponseOrderDto[]> {
    return from(window.electronAPI!.order.findAll(query));
  }
}
