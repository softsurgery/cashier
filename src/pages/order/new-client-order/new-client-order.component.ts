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

  tableId: number | null = null;
  orderId: number | null = null;
  readonly families$ = new BehaviorSubject<ResponseProductFamilyDto[]>([]);

  selectedFamily: ResponseProductFamilyDto | null = null;
  cart: CartItem[] = [];
  activeOrderId: number | null = null;
  activeOrderRemaining = 0;
  activeOrderPaidAmount = 0;
  isCreating = false;
  tableName!: string;

  ngOnInit(): void {
    const paramTableId =
      this.activatedRoute.snapshot.params['tableId'] ?? this.activatedRoute.snapshot.params['id'];
    const paramOrderId = this.activatedRoute.snapshot.params['orderId'];

    if (paramOrderId && !isNaN(Number(paramOrderId))) {
      this.orderId = Number(paramOrderId);
      this.loadOrderById(this.orderId);
    } else if (paramTableId && !isNaN(Number(paramTableId))) {
      this.tableId = Number(paramTableId);
      this.loadActiveOrder();
    } else {
      this.tableId = null;
      this.initEmptyState();
    }

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
        error: () => toast.error('Erreur lors du chargement des familles'),
      });
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
    this.cdr.detectChanges();
  }

  onCreateOrder(): void {
    if (this.cart.length === 0) {
      toast.error('Le panier est vide');
      return;
    }

    this.isCreating = true;
    this.cdr.detectChanges();

    // Ensure we have a valid numeric ID before updating
    const isUpdating = this.activeOrderId !== null && typeof this.activeOrderId === 'number';
    const orderData: CreateOrderDto = {
      tableId: this.tableId ?? undefined,
      products: this.cart.map((item) => ({
        orderId: 0,
        productId: item.product.id,
        quantity: item.quantity,
      })),
      status: isUpdating ? undefined : OrderStatus.UNPAID,
      total: this.cartTotal,
    };

    const save$ = isUpdating
      ? this.orderService.update(this.activeOrderId!, orderData)
      : this.orderService.create(orderData);

    save$.subscribe({
      next: (savedOrder: ResponseOrderDto | null) => {
        if (savedOrder) this.activeOrderId = savedOrder.id;
        this.isCreating = false;
        const msg = isUpdating ? 'Commande mise à jour' : 'Commande créée avec succès';
        toast.success(msg);
        if (this.activeOrderId !== null) this.loadOrderById(this.activeOrderId);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isCreating = false;
        const message = err?.message ?? 'Erreur lors de la création de la commande';
        toast.error(message);
        this.cdr.detectChanges();
      },
    });
  }

  onPaymentCompleted(): void {
    if (this.activeOrderId !== null) this.loadOrderById(this.activeOrderId);
  }

  get cartTotal(): number {
    return Number(
      this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2),
    );
  }

  private initEmptyState(): void {
    this.activeOrderId = null;
    this.activeOrderRemaining = 0;
    this.activeOrderPaidAmount = 0;
    this.cart = [];
    this.syncCartToStore();
    this.layoutService.setBreadcrumbs([
      { label: 'Orders', url: '/orders' },
      { label: 'Nouvelle Commande', url: '' },
    ]);
    this.cdr.detectChanges();
  }

  private syncCartToStore(): void {
    const orderProducts: CreateOrderProductDto[] = this.cart.map((item) => ({
      orderId: 0,
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const createDto: CreateOrderDto = {
      tableId: this.tableId ?? undefined,
      products: orderProducts,
      status: OrderStatus.UNPAID,
      total: this.cartTotal,
    };

    orderStateStore.update((state) => ({ ...state, createDto }));
  }

  private loadOrderById(orderId: number): void {
    this.orderService
      .findAll({
        where: { id: orderId },
        relations: ['products', 'products.product'],
        take: 1,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (orders) => {
          const order = orders?.[0];
          if (!order) {
            toast.error('Commande introuvable');
            this.initEmptyState();
            return;
          }

          this.activeOrderId = order.id;
          this.tableId = order.tableId ?? null;
          this.activeOrderPaidAmount = Number(order.paidAmount ?? 0);
          this.activeOrderRemaining = Number(order.total ?? 0) - this.activeOrderPaidAmount;

          const orderProducts = (order.products ??
            (order as any).OrderProducts ??
            []) as (ResponseOrderProductDto & { product?: ResponseProductDto })[];
          this.cart = orderProducts
            .filter((item) => !!item.product)
            .map((item) => ({
              product: item.product as ResponseProductDto,
              quantity: item.quantity,
            }));

          if (this.tableId !== null && this.tableId > 0) {
            this.tablesService.findOne(this.tableId).subscribe((table) => {
              this.tableName = table!.name;
              this.layoutService.setBreadcrumbs([
                { label: 'Orders', url: '/orders' },
                { label: `Commande #${order.id}`, url: '' },
                { label: `Table ${this.tableName}`, url: '' },
              ]);
              this.syncCartToStore();
              this.cdr.detectChanges();
            });
          } else {
            this.layoutService.setBreadcrumbs([
              { label: 'Orders', url: '/orders' },
              { label: `Commande #${order.id}`, url: '' },
            ]);
            this.syncCartToStore();
            this.cdr.detectChanges();
          }
        },
        error: () => {
          toast.error('Erreur lors du chargement de la commande');
          this.initEmptyState();
        },
      });
  }

  private loadActiveOrder(): void {
    if (!this.tableId) return this.initEmptyState();

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
            (order) =>
              order.status === OrderStatus.UNPAID || order.status === OrderStatus.PARTIALLY_PAID,
          );

          if (!activeOrder) {
            this.initEmptyState();
            return;
          }

          this.activeOrderId = activeOrder.id;
          this.activeOrderPaidAmount = Number(activeOrder.paidAmount ?? 0);
          this.activeOrderRemaining = Number(activeOrder.total ?? 0) - this.activeOrderPaidAmount;
          const orderProducts = (activeOrder.products ??
            (activeOrder as any).OrderProducts ??
            []) as (ResponseOrderProductDto & { product?: ResponseProductDto })[];
          this.cart = orderProducts
            .filter((item) => !!item.product)
            .map((item) => ({
              product: item.product as ResponseProductDto,
              quantity: item.quantity,
            }));

          this.tablesService.findOne(this.tableId!).subscribe((table) => {
            this.tableName = table!.name;
            this.layoutService.setBreadcrumbs([
              { label: 'Tables', url: '/zone-tables' },
              { label: `Nouvelle Commande`, url: '/new-client-order' },
              { label: `Table ${this.tableName}`, url: '' },
            ]);
            this.syncCartToStore();
            this.cdr.detectChanges();
          });
        },
        error: () => this.initEmptyState(),
      });
  }
}
