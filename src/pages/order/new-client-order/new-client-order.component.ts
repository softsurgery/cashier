import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LayoutService } from '@/components/layout/layout.service';
import { ProductFamilyService } from '../../product-family/product-family.service';
import { OrderService } from '@/pages/order/order.service';
import { orderStateStore } from '@/stores/order-state/order-state.store';
import {
  ResponseProductFamilyDto,
  ResponseProductDto,
  CreateOrderDto,
  CreateOrderProductDto,
  OrderStatus,
  ResponseOrderDto,
} from '@/types';
import { toast } from 'ngx-sonner';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';
import { ActivatedRoute } from '@angular/router';
import { TablesService } from '@/pages/tables/tables.service';

interface CartItem {
  product: ResponseProductDto;
  quantity: number;
}

@Component({
  selector: 'app-new-client-order',
  standalone: true,
  imports: [CommonModule, HlmResizableImports],
  templateUrl: './new-client-order.component.html',
  styleUrls: ['./new-client-order.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewClientOrderComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);
  private readonly productFamilyService = inject(ProductFamilyService);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly tablesService = inject(TablesService);

  tableId: number = Number(this.activatedRoute.snapshot.params['id']);
  readonly data$ = new BehaviorSubject<ResponseProductFamilyDto[]>([]);

  selectedFamily: ResponseProductFamilyDto | null = null;
  cart: CartItem[] = [];

  isCreating = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  tableName!: string;

  ngOnInit(): void {
    this.tablesService.findOne(this.tableId).subscribe((table) => {
      this.tableName = table!.name;

      this.layoutService.setBreadcrumbs([
        {
          label: 'Tables',
          url: '/zone-tables',
        },
        {
          label: `Nouvelle Commande`,
          url: '/new-client-order',
        },
        {
          label: `Table ${this.tableName}`,
          url: '',
        },
      ]);
    });

    this.productFamilyService
      .findAll({ relations: ['products'], take: 100, skip: 0 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (families) => {
          this.data$.next(families);
          if (families.length > 0 && !this.selectedFamily) {
            this.selectedFamily = families[0];
          }
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des familles';
          this.cdr.detectChanges();
        },
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
    this.syncCartToStore();
    this.clearMessages();
    this.cdr.detectChanges();
  }

  removeFromCart(product: ResponseProductDto): void {
    const index = this.cart.findIndex((item) => item.product.id === product.id);
    if (index === -1) return;

    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
    } else {
      this.cart.splice(index, 1);
    }
    this.syncCartToStore();
    this.clearMessages();
    this.cdr.detectChanges();
  }

  get cartTotal(): number {
    return Number(
      this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2),
    );
  }

  get canCreateOrder(): boolean {
    return this.cart.length > 0;
  }

  createOrder(): void {
    if (!this.canCreateOrder) {
      this.errorMessage = 'Le panier est vide';
      this.cdr.detectChanges();
      return;
    }

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();

    const orderData = {
      tableId: this.tableId,
      products: this.cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      status: OrderStatus.UNPAID,
      total: this.cartTotal,
    } as CreateOrderDto;

    this.orderService.create(orderData).subscribe({
      next: (createdOrder: ResponseOrderDto) => {
        this.cart = [];
        this.syncCartToStore();
        this.isCreating = false;
        toast.success('Commande créée avec succès');
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = null;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.isCreating = false;
        toast.error(err.message);
        this.cdr.detectChanges();
      },
    });
  }

  private syncCartToStore(): void {
    const orderProducts: CreateOrderProductDto[] = this.cart.map((item) => ({
      orderId: 0,
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const createDto: CreateOrderDto = {
      tableId: orderStateStore.getValue().createDto.tableId,
      products: orderProducts,
      status: OrderStatus.UNPAID,
      total: this.cartTotal,
    };

    orderStateStore.update((state) => ({
      ...state,
      createDto,
    }));
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }

  trackByFamilyId(index: number, family: ResponseProductFamilyDto): number {
    return family.id;
  }

  trackByProductId(index: number, product: ResponseProductDto): number {
    return product.id;
  }

  trackByCartItem(index: number, item: CartItem): number {
    return item.product.id;
  }
}
