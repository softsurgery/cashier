import { Routes } from '@angular/router';
import { OrderComponent } from '../pages/order/order.component';
import { ProductFamilyComponent } from '../pages/product-family/product-family.component';
import { ProductComponent } from '../pages/product/product.component';
import { TablesComponent } from '../pages/tables/tables.component';

export const routes: Routes = [
  {
    path: 'tables',
    component: TablesComponent,
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
