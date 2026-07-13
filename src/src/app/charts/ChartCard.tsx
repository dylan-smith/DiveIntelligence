import { useState } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { PlotlyChart } from './PlotlyChart';
import { GraphDialog } from './GraphDialog';
import { CHART_CONFIG } from './chart-common';
import './charts.css';

interface Props {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  show: boolean;
}

// The clickable chart tile used on the dive-overview page; opens the enlarged
// dialog view when the dive has segments to display.
export function ChartCard({ data, layout, show }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <button className="graph" onClick={() => show && setDialogOpen(true)}>
        {show ? (
          <PlotlyChart className="plotly-graph" data={data} layout={layout} config={CHART_CONFIG} />
        ) : (
          <div>Create dive segements to populate graphs</div>
        )}
      </button>
      {show && <GraphDialog open={dialogOpen} onClose={() => setDialogOpen(false)} data={data} layout={layout} />}
    </>
  );
}
