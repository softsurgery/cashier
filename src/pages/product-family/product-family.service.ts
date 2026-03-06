import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ResponseProductFamilyDto } from '../../types/product.family';

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyService {
  constructor() {}

  findAll(query: any): Observable<ResponseProductFamilyDto[]> {
    console.log(query);
    return from(window.electronAPI!.productFamily.findAll(query));
  }
}
