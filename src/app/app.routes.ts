import { Routes } from '@angular/router';
import { OrderComponent } from '../pages/order/order.component';
import { ProductFamilyComponent } from '../pages/product-family/product-family.component';
import { ProductComponent } from '../pages/product/product.component';
import { TablesComponent } from '../pages/tables/tables.component';
import { TableZoneComponent } from '@/pages/table-zone/table-zone.component';
import { ZoneTablesComponent } from '@/pages/table-view/table-view.component';
import { CaisseComponent } from '@/pages/caisse/caisse.component';

export const routes: Routes = [
  {
    path: 'tables',
    component: TablesComponent,
  },

  {
    path: 'caisse',
    component: CaisseComponent,
  },

  {
    path: 'zone-tables',
    component: ZoneTablesComponent,
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
