import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { TableZoneService } from '../table-zone/table-zone.service';
import { ResponseTableZoneDto, TableStatus } from '../../types';

@Component({
  selector: 'app-zone-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css'],
})
export class ZoneTablesComponent implements OnInit {
  private service = inject(TableZoneService);
  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);

  statuses: string[] = [];
  statusColors: Record<string, string> = {};
  statusBgColors: Record<string, string> = {};

  constructor() {
    this.statuses = Object.values(TableStatus);

    this.statusColors = {
      available: 'bg-gray-100 border-gray-300',
      occupied: 'bg-green-100 border-green-300',
      reserved: 'bg-purple-100 border-purple-300',
    };

    this.statusBgColors = {
      available: 'bg-gray-200',
      occupied: 'bg-green-200',
      reserved: 'bg-purple-200',
    };
  }

  changeStatus(table: { status: string }, status: string) {
    if (table.status === status) {
      return;
    }
    table.status = status;
    const zones = this.data.value;
    this.data.next([...zones]);
  }

  ngOnInit() {
    this.service
      .findAll({ relations: ['tables'], take: 100, skip: 0 })
      .subscribe((zones) => this.data.next(zones));
  }
}
