import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPrimengModule } from '../../modules/primeng/primeng.module';
import { FooterComponent } from './components/footer/footer.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { MenuitemComponent } from './components/menu-item/menu-item.component';
import { AppConfigModule } from './config/config.module';

@NgModule({
  declarations: [
    FooterComponent,
    TopbarComponent,
    SidebarComponent,
    MenuComponent,
    MenuitemComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    CustomPrimengModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppConfigModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
