import { provideZoneChangeDetection } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { APP_CONFIG } from './app.config';
import { AppModule } from './app/app.module';

fetch('/assets/config.json')
  .then(response => response.json())
  .then(config => {
    platformBrowserDynamic([{ provide: APP_CONFIG, useValue: config }])
      .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
      .catch(err => console.error(err));
  });
