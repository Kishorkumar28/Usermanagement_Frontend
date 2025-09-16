import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { BrowserModule } from '@angular/platform-browser';
import { ThemeService } from './theme.service';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'custom-select-panel' }
    }
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="p-6 dark:bg-gray-900">
      <router-outlet></router-outlet>
    </div>
  `
})

export class AppComponent {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.initTheme();
  }
}
