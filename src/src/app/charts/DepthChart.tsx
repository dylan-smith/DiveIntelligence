import { useMemo } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ChartCard } from './ChartCard';
import { ERROR_COLOR, PRIMARY_COLOR, getStandardChartLayout, toChartTimes } from './chart-common';

export function DepthChart() {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const show = planner.getDiveSegments().length > 2;

  const data = useMemo<Plotly.Data[]>(() => {
    const depthData = planner.getDepthChartData();
    const x = toChartTimes(depthData.map(d => d.time));

    return [
      {
        x,
        y: depthData.map(d => d.depth),
        type: 'scatter',
        mode: 'lines',
        name: 'Depth',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.0f}m`,
      },
      {
        x,
        y: depthData.map(d => d.ceiling),
        type: 'scatter',
        mode: 'lines',
        name: 'Ceiling',
        fill: 'tozeroy',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot',
          width: 0,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version]);

  const layout = useMemo<Partial<Plotly.Layout>>(() => {
    const result = getStandardChartLayout('Depth vs Ceiling');
    result.yaxis = { ...result.yaxis, autorange: 'reversed' };
    return result;
  }, []);

  return <ChartCard data={data} layout={layout} show={show} />;
}
