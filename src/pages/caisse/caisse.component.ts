import { LayoutService } from '@/components/layout/layout.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductFamilyService } from '../product-family/product-family.service';
import { ResponseProductFamilyDto } from '@/types';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-caisse.component',
  standalone: true,
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.css',
  imports: [CommonModule],
})
export class CaisseComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private productFamilyService = inject(ProductFamilyService);

  // Data observable for the template (async pipe)
  data = new BehaviorSubject<ResponseProductFamilyDto[]>([]);

  // Currently selected family (only its products are shown)
  selectedFamily: ResponseProductFamilyDto | null = null;

  // Subscription to avoid memory leaks
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Caisse',
        url: '/caisse',
      },
    ]);

    this.subscription = this.productFamilyService
      .findAll({ relations: ['products'], take: 100, skip: 0 })
      .subscribe((families) => {
        this.data.next(families);
        // Automatically select the first family once data arrives
        if (families.length > 0 && !this.selectedFamily) {
          this.selectedFamily = families[0];
        }
      });
  }

  // Called when a family header is clicked
  selectFamily(family: ResponseProductFamilyDto): void {
    this.selectedFamily = family;
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.subscription?.unsubscribe(); // Clean up subscription
  }
}