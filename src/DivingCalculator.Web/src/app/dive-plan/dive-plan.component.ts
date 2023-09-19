import { Component } from '@angular/core';

@Component({
  selector: 'dive-dive-plan',
  templateUrl: './dive-plan.component.html',
  styleUrls: ['./dive-plan.component.scss'],
})
export class DivePlanComponent {
  planEvents = [
    {
      Timestamp: '0:00:00',
      Title: 'Start',
      Description: 'Air (O<sub>2</sub>: 21%, He: 0%, N<sub>2</sub>: 79%)',
    },
    {
      Timestamp: '0:00:00',
      Title: 'Surface',
      Description: 'Ascent time: 0 min @ 10m/min',
    },
  ];

  onAddPlanEvent(event: Event) {
    this.planEvents.push({
      Timestamp: '1:00',
      Title: 'New Event',
      Description: 'New Event Description',
    });
  }
}
