import { Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

export const customersRoutes: Routes = [
  { path: '', component: CustomerListComponent },
];
