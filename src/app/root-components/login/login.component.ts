import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/service/app.layout.service';
import { Utils } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginComponent {
  valCheck: string[] = ['remember'];

  password!: string;

  constructor(public layoutService: LayoutService, private router: Router) {}

  login(): void {
    Utils.setItemFromToStorage('token', 'test-token');
    this.router.navigate(['/dashboard']);
  }
}
