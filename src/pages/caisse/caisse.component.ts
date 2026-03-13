import { LayoutService } from '@/components/layout/layout.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductFamilyService } from '../product-family/product-family.service';
import { ResponseProductFamilyDto, ResponseProductDto } from '@/types';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

interface CartItem {
  product: ResponseProductDto;
  quantity: number;
}

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

  data = new BehaviorSubject<ResponseProductFamilyDto[]>([]);
  selectedFamily: ResponseProductFamilyDto | null = null;
  private subscription: Subscription | null = null;

  cart: CartItem[] = [];

  ngOnInit() {
    this.layoutService.setBreadcrumbs([{ label: 'Caisse', url: '/caisse' }]);

    this.subscription = this.productFamilyService
      .findAll({ relations: ['products'], take: 100, skip: 0 })
      .subscribe((families) => {
        this.data.next(families);
        if (families.length > 0 && !this.selectedFamily) {
          this.selectedFamily = families[0];
        }
      });
  }

  selectFamily(family: ResponseProductFamilyDto): void {
    this.selectedFamily = family;
  }

  addToCart(product: ResponseProductDto): void {
    const existing = this.cart.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.subscription?.unsubscribe();
  }
}
