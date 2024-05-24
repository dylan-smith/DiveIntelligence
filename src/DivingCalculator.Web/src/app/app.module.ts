import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NewDiveComponent } from './new-dive/new-dive.component';
import { HomeComponent } from './home/home.component';
import { DiveOverviewComponent } from './dive-overview/dive-overview.component';
import { DivePlanComponent } from './dive-plan/dive-plan.component';
import { DiveSummaryComponent } from './dive-summary/dive-summary.component';
import { ErrorListComponent } from './error-list/error-list.component';
import { DepthChartComponent } from './depth-chart/depth-chart.component';
import { PO2ChartComponent } from './po2-chart/po2-chart.component';
import { ENDChartComponent } from './end-chart/end-chart.component';
import { TissuesCeilingChartComponent } from './tissues-ceiling-chart/tissues-ceiling-chart.component';
import { TissuesPN2ChartComponent } from './tissues-pn2-chart/tissues-pn2-chart.component';
import { TissuesPHeChartComponent } from './tissues-phe-chart/tissues-phe-chart.component';
import { CurrentStatsComponent } from './current-stats/current-stats.component';
import { NewDepthStatsComponent } from './new-depth-stats/new-depth-stats.component';
import { NewGasInputComponent } from './new-gas-input/new-gas-input.component';
import { NewGasStatsComponent } from './new-gas-stats/new-gas-stats.component';
import { HumanDurationPipe } from './pipes/human-duration.pipe';
import { ColonDurationPipe } from './pipes/colon-duration.pipe';

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
import { AddDiveSegmentComponent } from './add-dive-segment/add-dive-segment.component';
import { APP_CONFIG, AppConfig } from 'src/app.config';
import { ApplicationInsightsModule } from './application-insights.module';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  declarations: [
    AppComponent,
    NewDiveComponent,
    HomeComponent,
    DiveOverviewComponent,
    DivePlanComponent,
    DiveSummaryComponent,
    ErrorListComponent,
    DepthChartComponent,
    PO2ChartComponent,
    ENDChartComponent,
    TissuesCeilingChartComponent,
    TissuesPN2ChartComponent,
    TissuesPHeChartComponent,
    HumanDurationPipe,
    ColonDurationPipe,
    AddDiveSegmentComponent,
    CurrentStatsComponent,
    NewDepthStatsComponent,
    NewGasInputComponent,
    NewGasStatsComponent,
  ],
  imports: [
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
    YouTubePlayerModule,
  ],
  providers: [
    HumanDurationPipe,
    ColonDurationPipe,
    {
      provide: AppConfig,
      useFactory: (config: AppConfig) => config,
      deps: [APP_CONFIG],
    },
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
