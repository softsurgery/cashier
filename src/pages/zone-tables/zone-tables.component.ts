import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { TableZoneService } from '../table-zone/table-zone.service';
import { ResponseTableZoneDto } from '../../types';

@Component({
  selector: 'app-zone-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zone-tables.component.html',
  styleUrls: ['./zone-tables.component.css'],
})
export class ZoneTablesComponent implements OnInit {
  private service = inject(TableZoneService);
  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);

  ngOnInit() {
    // fetch zones with their tables
    this.service
      .findAll({ relations: ['tables'], take: 100, skip: 0 })
      .subscribe((zones) => this.data.next(zones));
  }
}
