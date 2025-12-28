import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export class ApplicationInsightsService {
  private appInsights?: ApplicationInsights;

  constructor(instrumentationKey?: string) {
    if (instrumentationKey && typeof window !== 'undefined') {
      this.appInsights = new ApplicationInsights({
        config: {
          instrumentationKey,
          enableAutoRouteTracking: true,
        },
      });
      this.appInsights.loadAppInsights();
    }
  }

  trackEvent(name: string, properties?: { [key: string]: any }): void {
    if (this.appInsights) {
      this.appInsights.trackEvent({ name }, properties);
    }
  }

  trackPageView(name?: string): void {
    if (this.appInsights) {
      this.appInsights.trackPageView({ name });
    }
  }
}
