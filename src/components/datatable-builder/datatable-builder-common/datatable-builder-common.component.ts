import { Component, Input } from '@angular/core';
import { DynamicDataTable } from '../datatable-builder.types';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-datatable-builder-common',
  templateUrl: './datatable-builder-common.component.html',
  styleUrls: ['./datatable-builder-common.component.css'],
  imports: [CommonModule],
})
export class DatatableBuilderCommonComponent {
  @Input() dataTableObject?: DynamicDataTable;
  @Input() datas: Observable<any[]> = of([]);
  @Input() totalRecords = 0;
  @Input() loading = false;
}
