// order-checkout.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseProductDto } from '@/types';

interface CartItem {
  product: ResponseProductDto;
  quantity: number;
}

@Component({
  selector: 'app-order-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-checkout.component.html',
  styleUrls: ['./order-checkout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCheckoutComponent {
  @Input({ required: true }) cart: CartItem[] = [];
  @Input() errorMessage: string | null = null;
  @Input() successMessage: string | null = null;
  @Input() isCreating = false;
  @Input() cartTotal = 0;
  @Output() removeFromCart = new EventEmitter<ResponseProductDto>();
  @Output() createOrder = new EventEmitter<void>();

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.id;
  }

  get canCreateOrder(): boolean {
    return this.cart.length > 0;
  }
}
