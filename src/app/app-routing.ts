import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './root-components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/product/product.routes').then(
            (m) => m.productRoutes
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./modules/customers/customers.routes').then(
            (m) => m.customersRoutes
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/order/order.routes').then((m) => m.orderRoutes),
      },
      {
        path: 'order-sources',
        loadChildren: () =>
          import('./modules/order-source/order-source.routes').then(
            (m) => m.orderSourceRoutes
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./modules/reports/reports.routes').then(
            (m) => m.reportsRoutes
          ),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', redirectTo: '/login' },
];
