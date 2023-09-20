import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewDiveComponent } from './new-dive/new-dive.component';
import { HomeComponent } from './home/home.component';
import { DivePlanComponent } from './dive-plan/dive-plan.component';
import { AddDiveSegmentComponent } from './add-dive-segment/add-dive-segment.component';

const routes: Routes = [
  { path: 'new-dive', component: NewDiveComponent },
  { path: 'dive-plan', component: DivePlanComponent },
  { path: 'add-dive-segment', component: AddDiveSegmentComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
