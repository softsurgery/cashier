import { Routes } from '@angular/router';
import { OrderComponent } from '../pages/order/order.component';
import { ProductFamilyComponent } from '../pages/product-family/product-family.component';
import { ProductComponent } from '../pages/product/product.component';

export const routes: Routes = [
  {
    path: 'tables',
    loadComponent: () => import('../pages/tables/table-management.component').then(m => m.TableManagementComponent)
  },
  {
    path: 'orders',
    component: OrderComponent,
  },
  {
    path: 'familles',
    component: ProductFamilyComponent,
  },
  {
    path: 'produits',
    component: ProductComponent,
  },
];
