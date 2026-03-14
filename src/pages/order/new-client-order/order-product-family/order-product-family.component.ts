// order-product-family.component.ts
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponseProductFamilyDto } from '@/types';

@Component({
  selector: 'app-order-product-family',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-product-family.component.html',
  styleUrls: ['./order-product-family.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProductFamilyComponent {
  @Input({ required: true }) families: ResponseProductFamilyDto[] | null = [];
  @Input() selectedFamily: ResponseProductFamilyDto | null = null;
  @Output() familySelected = new EventEmitter<ResponseProductFamilyDto>();

  selectFamily(family: ResponseProductFamilyDto): void {
    this.familySelected.emit(family);
  }

  trackByFamilyId(index: number, family: ResponseProductFamilyDto): number {
    return family.id;
  }
}
