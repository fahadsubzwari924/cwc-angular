import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) {}
}
