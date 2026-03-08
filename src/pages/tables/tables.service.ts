import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { FindManyOptions } from 'typeorm';
import { CreateTableDto, ResponseTableDto } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  constructor() {}

  findAll(query: FindManyOptions<ResponseTableDto>): Observable<ResponseTableDto[]> {
    return from(window.electronAPI!.table.findAll(query));
  }

  create(data: CreateTableDto): Observable<ResponseTableDto> {
    return from(window.electronAPI!.table.create(data));
  }
}
