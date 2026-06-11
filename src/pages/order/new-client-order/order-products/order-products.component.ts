// order-products.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseProductFamilyDto, ResponseProductDto } from '@/types';
import { formatAmount } from '../../utils/order-status.utils';

@Component({
  selector: 'app-order-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProductsComponent {
  readonly formatAmount = formatAmount;
  @Input() selectedFamily: ResponseProductFamilyDto | null = null;
  @Output() addToCart = new EventEmitter<ResponseProductDto>();

  trackByProductId(index: number, product: ResponseProductDto): number {
    return product.id;
  }
}
