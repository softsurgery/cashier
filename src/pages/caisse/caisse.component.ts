import { LayoutService } from '@/components/layout/layout.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-caisse.component',
  imports: [],
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.css',
})
export class CaisseComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Caisse',
        url: '/caisse',
      },
    ]);
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
  }
}
