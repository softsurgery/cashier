import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { FindManyOptions } from 'typeorm';
import { ResponseProductDto } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  findAll(query: FindManyOptions<ResponseProductDto>): Observable<ResponseProductDto[]> {
    return from(window.electronAPI!.product.findAll(query));
  }
}
