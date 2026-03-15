import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { LayoutService } from '../../service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MenuItemComponent],
})
export class MenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/dashboard'],
          },
        ],
      },
      {
        label: 'Manage Products',
        items: [
          {
            label: 'Products',
            icon: 'pi pi-fw pi-th-large',
            routerLink: ['/products'],
          },
        ],
      },
      {
        label: 'Manage Customers',
        items: [
          {
            label: 'Customers',
            icon: 'pi pi-fw pi-users',
            routerLink: ['/customers'],
          },
        ],
      },
      {
        label: 'Manage Orders',
        items: [
          {
            label: 'Orders',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: ['/orders'],
          },
          {
            label: 'Create Order',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/orders/create'],
          },
        ],
      },
      {
        label: 'Manage Order Sources',
        items: [
          {
            label: 'Order Sources',
            icon: 'pi pi-fw pi-sitemap',
            routerLink: ['/order-sources'],
          },
        ],
      },
      {
        label: 'Business Insights',
        items: [
          {
            label: 'Reports',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['/reports'],
          },
        ],
      },
    ];
  }
}

