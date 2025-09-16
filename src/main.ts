import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { Chart, registerables } from 'chart.js';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

Chart.register(...registerables);
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'custom-select-panel' }
    }, provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
