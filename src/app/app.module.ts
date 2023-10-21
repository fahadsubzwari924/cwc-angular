import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './root-components/register/register.component';
import { LoginComponent } from './root-components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CustomPrimengModule } from './modules/primeng/primeng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './core/layout/layout.module';

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent],
  imports: [
    AppRoutingModule,
    CustomPrimengModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
