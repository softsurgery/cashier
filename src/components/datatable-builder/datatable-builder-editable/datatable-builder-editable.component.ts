import { Component, Input } from "@angular/core";
import { DynamicDataTable } from "../datatable-builder.types";

@Component({
  selector: "app-datatable-builder-editable",
  templateUrl: "./datatable-builder-editable.component.html",
  styleUrls: ["./datatable-builder-editable.component.css"],
})
export class DatatableBuilderEditableComponent {
  @Input() dataTableObject?: DynamicDataTable;
  @Input() datas: any[] = [];
  @Input() totalRecords = 0;
  @Input() loading = false;
}
