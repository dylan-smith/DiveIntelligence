import { useMemo } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ChartCard } from './ChartCard';
import { PRIMARY_COLOR, getStandardChartLayout, toChartTimes } from './chart-common';

export function TissuesCeilingChart() {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const show = planner.getDiveSegments().length > 2;

  const data = useMemo<Plotly.Data[]>(() => {
    const ceilingData = planner.getTissuesCeilingChartData();
    const x = toChartTimes(ceilingData.map(d => d.time));

    const ceilingTraces: Plotly.Data[] = [];

    for (let i = 1; i <= 16; i++) {
      ceilingTraces.push({
        x,
        y: ceilingData.map(d => d.tissuesCeiling[i - 1]),
        type: 'scatter',
        mode: 'lines',
        name: `Tissue ${i} Ceiling`,
        line: {
          width: 2,
        },
        hovertemplate: `%{y:.0f}m`,
      });
    }

    return [
      {
        x,
        y: ceilingData.map(d => d.depth),
        type: 'scatter',
        mode: 'lines',
        name: 'Depth',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.0f}m`,
      },
      ...ceilingTraces,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version]);

  const layout = useMemo<Partial<Plotly.Layout>>(() => {
    const result = getStandardChartLayout('Tissues Ceiling vs Depth');
    result.yaxis = { ...result.yaxis, autorange: 'reversed' };
    return result;
  }, []);

  return <ChartCard data={data} layout={layout} show={show} />;
}
