import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/core/layout/service/app.layout.service';
import { LoginResponse } from 'src/app/core/models/login-response.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Utils } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  valCheck: string[] = ['remember'];

  loginForm!: FormGroup;
  isLoading = false;

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
    this.isLoading = true;
    this.authService
      .signIn(this.loginForm.value)
      .subscribe((response: LoginResponse) => {
        this.isLoading = false;
        Utils.setItemFromToStorage('token', response.accessToken);
        this.router.navigate(['/dashboard']);
      });
  }

  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }
}
