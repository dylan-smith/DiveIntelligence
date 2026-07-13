import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import type { ICustomProperties } from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | undefined;

export function initAppInsights(instrumentationKey: string): void {
  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey,
      enableAutoRouteTracking: true,
    },
  });
  appInsights.loadAppInsights();
}

export function trackEvent(name: string, customProperties?: ICustomProperties): void {
  appInsights?.trackEvent({ name }, customProperties);
}

export function trackTrace(message: string): void {
  appInsights?.trackTrace({ message });
}

export function trackException(error: Error): void {
  appInsights?.trackException({ exception: error });
}
