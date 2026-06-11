import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { OrderStatus, ResponseProductDto } from '@/types';
import {
  formatAmount,
  getOrderStatusBadgeVariant,
  getOrderStatusLabel,
} from '../../utils/order-status.utils';

interface CartItem {
  product: ResponseProductDto;
  quantity: number;
}

@Component({
  selector: 'app-order-checkout',
  standalone: true,
  imports: [CommonModule, HlmBadgeImports, HlmButtonImports],
  templateUrl: './order-checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCheckoutComponent {
  @Input({ required: true }) cart: CartItem[] = [];
  @Input() errorMessage: string | null = null;
  @Input() successMessage: string | null = null;
  @Input() isCreating = false;
  @Input() cartTotal = 0;
  @Input() activeOrderId: number | null = null;
  @Input() orderStatus: OrderStatus | null = null;
  @Input() paidAmount = 0;
  @Input() remainingAmount = 0;
  @Output() removeFromCart = new EventEmitter<ResponseProductDto>();
  @Output() createOrder = new EventEmitter<void>();

  readonly formatAmount = formatAmount;

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.id;
  }

  get canCreateOrder(): boolean {
    return this.cart.length > 0;
  }

  get statusLabel(): string {
    return this.orderStatus ? getOrderStatusLabel(this.orderStatus) : '';
  }

  get statusBadgeVariant() {
    return this.orderStatus ? getOrderStatusBadgeVariant(this.orderStatus) : 'outline';
  }
}
