import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularPlugin } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsights, ICustomProperties, ITelemetryPlugin } from '@microsoft/applicationinsights-web';
import { AppConfig } from 'src/app.config';

@Injectable()
export class ApplicationInsightsService {
  private angularPlugin = new AngularPlugin();
  private appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: this.appConfig.instrumentationKey,
      extensions: [this.angularPlugin as unknown as ITelemetryPlugin],
      extensionConfig: {
        [this.angularPlugin.identifier]: {
          router: this.router,
          errorServices: [new ErrorHandler()],
        },
      },
    },
  });

  constructor(
    private router: Router,
    private appConfig: AppConfig
  ) {
    this.appInsights.loadAppInsights();
  }

  // expose methods that can be used in components and services
  trackEvent(name: string, customProperties: ICustomProperties | undefined): void {
    this.appInsights.trackEvent({ name }, customProperties);
  }

  trackTrace(message: string): void {
    this.appInsights.trackTrace({ message });
  }
}
