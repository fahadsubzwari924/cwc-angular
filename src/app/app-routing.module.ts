import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './root-components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/product/product.module').then(
            (m) => m.ProductModule
          ),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./modules/customers/customers.module').then(
            (m) => m.CustomersModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/order/order.module').then((m) => m.OrderModule),
      },
      {
        path: 'order-sources',
        loadChildren: () =>
          import('./modules/order-source/order-source.module').then(
            (m) => m.OrderSourceModule
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
