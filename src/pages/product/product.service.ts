import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { FindManyOptions } from 'typeorm';
import { CreateProductDto, ResponseProductDto } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  findAll(query: FindManyOptions<ResponseProductDto>): Observable<ResponseProductDto[]> {
    return from(window.electronAPI!.product.findAll(query));
  }

  findOne(id: number) {
    return from(window.electronAPI!.product.findOneById(id));
  }

  create(data: CreateProductDto): Observable<ResponseProductDto> {
    return from(window.electronAPI!.product.create(data));
  }

  update(id: number, data: Partial<CreateProductDto>) {
    return from(window.electronAPI!.product.update(id, data));
  }

  delete(id: number) {
    return from(window.electronAPI!.product.delete(id));
  }
}
