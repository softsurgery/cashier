import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import type { FindManyOptions } from 'typeorm';
import { CreateTableZoneDto, ResponseTableZoneDto } from '../../types';
import type { PaginatedResponse } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class TableZoneService {
  constructor() {}

  findAll(query: FindManyOptions<ResponseTableZoneDto> = {}): Observable<ResponseTableZoneDto[]> {
    return from(window.electronAPI!.tableZone.findAll(query));
  }

  findAllPaginated(query: FindManyOptions<ResponseTableZoneDto>): Observable<PaginatedResponse<ResponseTableZoneDto>> {
    return from(window.electronAPI!.tableZone.findAllPaginated(query));
  }

  findOne(id: number) {
    return from(window.electronAPI!.tableZone.findOneById(id));
  }

  create(data: CreateTableZoneDto): Observable<ResponseTableZoneDto> {
    return from(window.electronAPI!.tableZone.create(data));
  }

  update(id: number, data: Partial<CreateTableZoneDto>) {
    return from(window.electronAPI!.tableZone.update(id, data));
  }

  delete(id: number) {
    return from(window.electronAPI!.tableZone.delete(id));
  }
}
