import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { FindManyQueryDto } from '../../types';
import { CreateProductDto, ResponseProductDto } from '../../types';
import type { PaginatedResponse } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor() {}

  findAll(query: FindManyQueryDto = {}): Observable<ResponseProductDto[]> {
    return from(window.electronAPI!.product.findAll(query));
  }

  findAllPaginated(query: FindManyQueryDto = {}): Observable<PaginatedResponse<ResponseProductDto>> {
    return from(window.electronAPI!.product.findAllPaginated(query));
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
