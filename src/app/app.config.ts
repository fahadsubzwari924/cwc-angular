import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withPreloading,
  NoPreloading,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { appRoutes } from './app-routing';
import { AuthGuard } from './core/guards/auth.guard';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withPreloading(NoPreloading)
    ),
    provideAnimations(),
    provideHttpClient(),
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    AuthGuard,
    MessageService,
    DialogService,
  ],
};

