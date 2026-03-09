import { Routes } from '@angular/router';
import { OrderComponent } from '../pages/order/order.component';
import { ProductFamilyComponent } from '../pages/product-family/product-family.component';
import { ProductComponent } from '../pages/product/product.component';
import { TablesComponent } from '../pages/tables/tables.component';
import { TableZoneComponent } from '@/pages/table-zone/table-zone.component';

export const routes: Routes = [
  {
    path: 'tables',
    component: TablesComponent,
  },
  {
    path: 'table-zone',
    component: TableZoneComponent,
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
