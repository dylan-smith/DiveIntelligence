import { useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import * as Plotly from 'plotly.js-basic-dist-min';
import { PlotlyChart } from './PlotlyChart';
import { CHART_CONFIG } from './chart-common';
import './charts.css';

interface Props {
  open: boolean;
  onClose: () => void;
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
}

export function GraphDialog({ open, onClose, data, layout }: Props) {
  const dialogLayout = useMemo(() => ({ ...layout, margin: { l: 65, r: 40, b: 60, t: 50, pad: 10 } }), [layout]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      transitionDuration={0}
      slotProps={{ paper: { sx: { width: '80%', height: '80%', maxWidth: 'none' } } }}>
      <div className="dialog-graph">
        <PlotlyChart className="plotly-graph" data={data} layout={dialogLayout} config={CHART_CONFIG} />
      </div>
    </Dialog>
  );
}
