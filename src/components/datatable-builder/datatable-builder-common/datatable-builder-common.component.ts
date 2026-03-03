import { Component, Input } from "@angular/core";
import { DynamicDataTable } from "../datatable-builder.types";

@Component({
  selector: "app-datatable-builder-common",
  templateUrl: "./datatable-builder-common.component.html",
  styleUrls: ["./datatable-builder-common.component.css"],
})
export class DatatableBuilderCommonComponent {
  @Input() dataTableObject?: DynamicDataTable;
  @Input() datas: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
}
