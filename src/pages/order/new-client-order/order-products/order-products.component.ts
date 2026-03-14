// order-products.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseProductFamilyDto, ResponseProductDto } from '@/types';

@Component({
  selector: 'app-order-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-products.component.html',
  styleUrls: ['./order-products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProductsComponent {
  @Input() selectedFamily: ResponseProductFamilyDto | null = null;
  @Output() addToCart = new EventEmitter<ResponseProductDto>();

  trackByProductId(index: number, product: ResponseProductDto): number {
    return product.id;
  }
}
