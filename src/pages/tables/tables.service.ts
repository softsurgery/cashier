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

  findOne(id: number) {
    return from(window.electronAPI!.table.findOneById(id));
  }

  create(data: CreateTableDto): Observable<ResponseTableDto> {
    return from(window.electronAPI!.table.create(data));
  }

  update(id: number, data: Partial<CreateTableDto>) {
    return from(window.electronAPI!.table.update(id, data));
  }

  delete(id: number) {
    return from(window.electronAPI!.table.delete(id));
  }
}
