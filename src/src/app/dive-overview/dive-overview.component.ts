import { Component } from '@angular/core';
import { DivePlanComponent } from '../dive-plan/dive-plan.component';
import { DiveSummaryComponent } from '../dive-summary/dive-summary.component';
import { ErrorListComponent } from '../error-list/error-list.component';
import { DepthChartComponent } from '../depth-chart/depth-chart.component';
import { PO2ChartComponent } from '../po2-chart/po2-chart.component';
import { ENDChartComponent } from '../end-chart/end-chart.component';
import { TissuesCeilingChartComponent } from '../tissues-ceiling-chart/tissues-ceiling-chart.component';
import { TissuesPN2ChartComponent } from '../tissues-pn2-chart/tissues-pn2-chart.component';
import { TissuesPHeChartComponent } from '../tissues-phe-chart/tissues-phe-chart.component';

@Component({
  selector: 'dive-dive-overview',
  templateUrl: './dive-overview.component.html',
  styleUrls: ['./dive-overview.component.scss'],
  imports: [
    DivePlanComponent,
    DiveSummaryComponent,
    ErrorListComponent,
    DepthChartComponent,
    PO2ChartComponent,
    ENDChartComponent,
    TissuesCeilingChartComponent,
    TissuesPN2ChartComponent,
    TissuesPHeChartComponent,
  ],
})
export class DiveOverviewComponent {}
