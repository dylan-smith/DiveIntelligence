import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewDiveComponent } from './new-dive/new-dive.component';
import { HomeComponent } from './home/home.component';
import { DiveOverviewComponent } from './dive-overview/dive-overview.component';
import { AddDiveSegmentComponent } from './add-dive-segment/add-dive-segment.component';
import { ChangeDepthComponent } from './change-depth/change-depth.component';
import { ChangeGasComponent } from './change-gas/change-gas.component';
import { MaintainDepthComponent } from './maintain-depth/maintain-depth.component';

const routes: Routes = [
  { path: 'new-dive', component: NewDiveComponent },
  { path: 'dive-overview', component: DiveOverviewComponent },
  { path: 'add-dive-segment', component: AddDiveSegmentComponent },
  { path: 'change-depth', component: ChangeDepthComponent },
  { path: 'change-gas', component: ChangeGasComponent },
  { path: 'maintain-depth', component: MaintainDepthComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
