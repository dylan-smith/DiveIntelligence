import { ErrorHandler, NgModule, inject } from '@angular/core';
import { ApplicationinsightsAngularpluginErrorService } from '@microsoft/applicationinsights-angularplugin-js';
import { ApplicationInsightsService } from './application-insights-service/application-insights.service';

@NgModule({
  providers: [
    ApplicationInsightsService,
    {
      provide: ErrorHandler,
      useClass: ApplicationinsightsAngularpluginErrorService,
    },
  ],
})
export class ApplicationInsightsModule {
  private applicationInsightsService = inject(ApplicationInsightsService);
}
