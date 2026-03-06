import { Routes } from '@angular/router';
import { TablesComponent } from '../pages/tables/tables.component';
import { OrderComponent } from '../pages/order/order.component';
import { ProductFamilyComponent } from '../pages/product-family/product-family.component';

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
];
