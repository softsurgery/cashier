import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { FindManyOptions } from 'typeorm';
import { CreateProductFamilyDto, ResponseProductFamilyDto } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyService {
  constructor() {}

  findAll(
    query: FindManyOptions<ResponseProductFamilyDto>,
  ): Observable<ResponseProductFamilyDto[]> {
    return from(window.electronAPI!.productFamily.findAll(query));
  }

  findOne(id: number) {
    return from(window.electronAPI!.productFamily.findOneById(id));
  }

  create(data: CreateProductFamilyDto): Observable<ResponseProductFamilyDto> {
    return from(window.electronAPI!.productFamily.create(data));
  }

  update(id: number, data: Partial<CreateProductFamilyDto>) {
    return from(window.electronAPI!.productFamily.update(id, data));
  }

  delete(id: number) {
    return from(window.electronAPI!.productFamily.delete(id));
  }
}
