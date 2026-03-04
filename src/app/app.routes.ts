import { Routes } from '@angular/router';
import { TablesComponent } from '../pages/tables/tables.component';
import { OrderComponent } from '../pages/order/order.component';

export const routes: Routes = [
  {
    path: 'tables',
    component: TablesComponent,
  },
  {
    path: 'orders',
    component: OrderComponent,
  },
];
