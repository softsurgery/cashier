// new-client-order.component.ts
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
import { ActivatedRoute } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmResizableImports } from '@spartan-ng/helm/resizable';

import { LayoutService } from '@/components/layout/layout.service';
import { ProductFamilyService } from '../../product-family/product-family.service';
import { OrderService } from '@/pages/order/order.service';
import { orderStateStore } from '@/stores/order-state/order-state.store';
import { TablesService } from '@/pages/tables/tables.service';
import {
  ResponseOrderProductDto,
  ResponseProductFamilyDto,
  ResponseProductDto,
  CreateOrderDto,
  CreateOrderProductDto,
  OrderStatus,
  ResponseOrderDto,
} from '@/types';
import { OrderProductFamilyComponent } from './order-product-family/order-product-family.component';
import { OrderProductsComponent } from './order-products/order-products.component';
import { OrderCheckoutComponent } from './order-checkout/order-checkout.component';
import { OrderKeyboardComponent } from './order-keyboard/order-keyboard.component';

interface CartItem {
  product: ResponseProductDto;
  quantity: number;
}

@Component({
  selector: 'app-new-client-order',
  standalone: true,
  imports: [
    CommonModule,
    HlmResizableImports,
    OrderProductFamilyComponent,
    OrderProductsComponent,
    OrderCheckoutComponent,
    OrderKeyboardComponent,
  ],
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
  readonly families$ = new BehaviorSubject<ResponseProductFamilyDto[]>([]);

  selectedFamily: ResponseProductFamilyDto | null = null;
  cart: CartItem[] = [];
  activeOrderId: number | null = null;
  activeOrderRemaining = 0;
  activeOrderPaidAmount = 0;

  isCreating = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  tableName!: string;

  ngOnInit(): void {
    this.tablesService.findOne(this.tableId).subscribe((table) => {
      this.tableName = table!.name;
      this.layoutService.setBreadcrumbs([
        { label: 'Tables', url: '/zone-tables' },
        { label: `Nouvelle Commande`, url: '/new-client-order' },
        { label: `Table ${this.tableName}`, url: '' },
      ]);
    });

    this.productFamilyService
      .findAll({ relations: ['products'], take: 100, skip: 0 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (families) => {
          this.families$.next(families);
          if (families.length > 0 && !this.selectedFamily) {
            this.selectedFamily = families[0];
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Erreur lors du chargement des familles';
          this.cdr.detectChanges();
        },
      });

    this.loadActiveOrder();
  }

  onFamilySelected(family: ResponseProductFamilyDto): void {
    this.selectedFamily = family;
  }

  onAddToCart(product: ResponseProductDto): void {
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

  onRemoveFromCart(product: ResponseProductDto): void {
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

  onCreateOrder(): void {
    if (this.cart.length === 0) {
      this.errorMessage = 'Le panier est vide';
      this.cdr.detectChanges();
      return;
    }

    this.isCreating = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.cdr.detectChanges();

    const orderData: CreateOrderDto = {
      tableId: this.tableId,
      products: this.cart.map((item) => ({
        orderId: 0,
        productId: item.product.id,
        quantity: item.quantity,
      })),
      status: OrderStatus.UNPAID,
      total: this.cartTotal,
    };

    const isUpdatingExistingOrder = this.activeOrderId !== null;
    const save$ = isUpdatingExistingOrder
      ? this.orderService.update(this.activeOrderId!, orderData)
      : this.orderService.create(orderData);

    save$.subscribe({
      next: (savedOrder: ResponseOrderDto | null) => {
        if (savedOrder) {
          this.activeOrderId = savedOrder.id;
        }
        this.isCreating = false;
        toast.success(isUpdatingExistingOrder ? 'Commande mise a jour' : 'Commande creee avec succes');
        this.loadActiveOrder();
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

  onPaymentCompleted(): void {
    this.loadActiveOrder();
  }

  get cartTotal(): number {
    return Number(
      this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2),
    );
  }

  private syncCartToStore(): void {
    const orderProducts: CreateOrderProductDto[] = this.cart.map((item) => ({
      orderId: 0,
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const createDto: CreateOrderDto = {
      tableId: this.tableId,
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

  private loadActiveOrder(): void {
    this.orderService
      .findAll({
        where: { tableId: this.tableId },
        relations: ['products', 'products.product'],
        order: { id: 'DESC' },
        take: 20,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          const activeOrder = orders.find(
            (order) => order.status === OrderStatus.UNPAID || order.status === OrderStatus.PARTIALLY_PAID,
          );

          if (!activeOrder) {
            this.activeOrderId = null;
            this.activeOrderRemaining = 0;
            this.activeOrderPaidAmount = 0;
            this.cart = [];
            this.syncCartToStore();
            this.cdr.detectChanges();
            return;
          }

          this.activeOrderId = activeOrder.id;
          this.activeOrderRemaining = Number(activeOrder.total ?? 0);
          this.activeOrderPaidAmount = Number(activeOrder.paidAmount ?? 0);
          const activeOrderProducts = (activeOrder.products ??
            activeOrder.OrderProducts ??
            []) as (ResponseOrderProductDto & { product?: ResponseProductDto })[];

          this.cart = activeOrderProducts
            .filter((item) => !!item.product)
            .map((item) => ({
              product: item.product as ResponseProductDto,
              quantity: item.quantity,
            }));
          this.syncCartToStore();
          this.cdr.detectChanges();
        },
        error: () => {
          this.activeOrderId = null;
          this.activeOrderRemaining = 0;
          this.activeOrderPaidAmount = 0;
          this.cart = [];
          this.syncCartToStore();
          this.cdr.detectChanges();
        },
      });
  }
}
