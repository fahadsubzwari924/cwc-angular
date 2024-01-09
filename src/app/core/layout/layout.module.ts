import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';

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
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppConfigModule,
    MenuModule,
    PanelMenuModule,
    ButtonModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
