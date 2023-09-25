import { InjectionToken } from '@angular/core';

export class AppConfig {
  instrumentationKey!: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
