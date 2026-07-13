import { useMemo, useState } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { PlotlyChart } from './PlotlyChart';
import { GraphDialog } from './GraphDialog';
import { PRIMARY_COLOR, CHART_CONFIG, toChartTimes } from './chart-common';
import './charts.css';

const NEW_DEPTH_COLOR = 'red';

interface Props {
  timeAtDepth: number;
}

export function CeilingChart({ timeAtDepth }: Props) {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();
  const [dialogOpen, setDialogOpen] = useState(false);

  const data = useMemo<Plotly.Data[]>(() => {
    const ceilingData = planner.getCeilingChartData(planner.getCurrentDepth(), planner.getCurrentGas());

    return [
      {
        x: toChartTimes(ceilingData.map(d => d.time)),
        y: ceilingData.map(d => d.ceiling),
        type: 'scatter',
        mode: 'lines',
        name: 'Ceiling',
        line: {
          color: PRIMARY_COLOR,
          width: 2,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version]);

  const layout = useMemo<Partial<Plotly.Layout>>(
    () => ({
      autosize: false,
      showlegend: false,
      title: {
        text: 'Ceiling Over Time',
        y: 0.98,
      },
      margin: { l: 35, r: 10, b: 30, t: 20, pad: 10 },
      xaxis: {
        fixedrange: true,
        tickformat: '%H:%M:%S',
      },
      yaxis: {
        fixedrange: true,
        autorange: 'reversed',
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(200, 200, 200, 0.25)',
        bordercolor: 'rgba(200, 200, 200, 0.4)',
      },
      shapes: [
        {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: new Date(1970, 1, 1, 0, 0, timeAtDepth * 60, 0),
          x1: new Date(1970, 1, 1, 0, 0, timeAtDepth * 60, 0),
          y0: 0,
          y1: 1,
          line: {
            color: NEW_DEPTH_COLOR,
            width: 1,
            dash: 'dot',
          },
        },
      ],
    }),
    [timeAtDepth]
  );

  return (
    <div className="dive-ceiling-chart">
      <button className="ceiling-chart" onClick={() => setDialogOpen(true)}>
        <PlotlyChart className="plotly-graph" data={data} layout={layout} config={CHART_CONFIG} />
      </button>
      <GraphDialog open={dialogOpen} onClose={() => setDialogOpen(false)} data={data} layout={layout} />
    </div>
  );
}
