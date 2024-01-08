import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './root-components/register/register.component';
import { LoginComponent } from './root-components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './core/layout/layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
