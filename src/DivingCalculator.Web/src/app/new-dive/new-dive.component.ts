import { Component } from '@angular/core';

@Component({
  selector: 'dive-new-dive',
  templateUrl: './new-dive.component.html',
  styleUrls: ['./new-dive.component.scss']
})
export class NewDiveComponent {
  getTooltipText() : string {
    return 'Max Depth (PO2): 56m (66m deco)\nMax Depth (END): 40m';
  }
}
