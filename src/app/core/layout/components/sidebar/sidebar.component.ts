import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { LayoutService } from '../../service/app.layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MenuComponent],
})
export class SidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
