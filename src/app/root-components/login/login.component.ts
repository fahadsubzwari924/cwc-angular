import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/service/app.layout.service';
import { LoginResponse } from 'src/app/core/models/login-response.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/services/utils.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  valCheck = ['remember'];
  loginForm!: FormGroup;
  isLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  get controls() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.createLoginForm();
  }

  login(): void {
    this.isLoading.set(true);
    this.authService
      .signIn(this.loginForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: LoginResponse) => {
          this.isLoading.set(false);
          Utils.setItemFromToStorage('token', response.accessToken);
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }
}
