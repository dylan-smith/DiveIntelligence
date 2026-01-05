import { importProvidersFrom } from '@angular/core';
import { APP_CONFIG } from './app.config';

import { HumanDurationPipe } from './app/pipes/human-duration.pipe';
import { ColonDurationPipe } from './app/pipes/colon-duration.pipe';
import { AppConfig } from 'src/app.config';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { ApplicationInsightsModule } from './app/application-insights.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AppComponent } from './app/app.component';

fetch('/assets/config.json')
  .then(response => response.json())
  .then(fetchedConfig => {
    bootstrapApplication(AppComponent, {
      providers: [
        importProvidersFrom(
          BrowserModule,
          AppRoutingModule,
          ApplicationInsightsModule,
          BrowserAnimationsModule,
          MatButtonModule,
          MatRadioModule,
          MatListModule,
          FormsModule,
          MatInputModule,
          MatFormFieldModule,
          MatTooltipModule,
          MatIconModule,
          MatSelectModule,
          MatDialogModule,
          MatSlideToggleModule,
          YouTubePlayerModule
        ),
        HumanDurationPipe,
        ColonDurationPipe,
        {
          provide: AppConfig,
          useValue: fetchedConfig,
        },
        { provide: APP_CONFIG, useValue: fetchedConfig },
        { provide: Window, useValue: window },
      ],
    }).catch(err => console.error(err));
  });
