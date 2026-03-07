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

  create(data: CreateProductFamilyDto): Observable<ResponseProductFamilyDto> {
    return from(window.electronAPI!.productFamily.create(data));
  }
}
