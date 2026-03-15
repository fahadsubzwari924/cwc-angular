import { Component, OnInit, signal } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { RouterOutlet } from '@angular/router';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, DynamicDialogModule],
})
export class AppComponent implements OnInit {
  rippleEnabled = signal(false);

  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.rippleEnabled.set(true);
  }
}
