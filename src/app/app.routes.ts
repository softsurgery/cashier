import { Routes } from '@angular/router';
import { OrderComponent } from '../pages/order/order.component';
import { ProductFamilyComponent } from '../pages/product-family/product-family.component';
import { ProductComponent } from '../pages/product/product.component';
import { TablesComponent } from '../pages/tables/tables.component';
import { TableZoneComponent } from '@/pages/table-zone/table-zone.component';
import { ZoneTablesComponent } from '@/pages/table-view/table-view.component';
import { NewClientOrderComponent } from '@/pages/order/new-client-order/new-client-order.component';
import { LoginComponent } from '@/pages/auth/login.component';
import { authGuard } from '@/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'new-client-order',
    component: NewClientOrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'new-client-order/order/:orderId',
    component: NewClientOrderComponent,
    canActivate: [authGuard],
  },

  {
    path: 'new-client-order/:tableId',
    component: NewClientOrderComponent,
    canActivate: [authGuard],
  },

  {
    path: 'zone-tables',
    component: ZoneTablesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'table-zone',
    component: TableZoneComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'familles',
    component: ProductFamilyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'produits',
    component: ProductComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
