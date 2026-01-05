import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import * as Plotly from 'plotly.js-basic-dist-min';

@Component({
  selector: 'dive-graph-dialog',
  templateUrl: './graph-dialog.component.html',
  imports: [MatDialogModule],
  styleUrls: ['./graph-dialog.component.scss'],
})
export class GraphDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GraphDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraphDialogData
  ) {}

  ngOnInit(): void {
    this.data.layout.margin = { l: 65, r: 40, b: 60, t: 50, pad: 10 };
    Plotly.newPlot('chart', this.data.trace, this.data.layout, this.data.options);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface GraphDialogData {
  trace: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  options: Partial<Plotly.Config>;
}
