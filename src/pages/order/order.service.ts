import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ResponseOrderDto } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor() {}

  findAll(query: any): Observable<ResponseOrderDto[]> {
    return from(window.electronAPI!.order.findAll(query));
  }
}
