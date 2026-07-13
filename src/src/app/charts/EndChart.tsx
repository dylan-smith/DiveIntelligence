import { useMemo } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ChartCard } from './ChartCard';
import { ERROR_COLOR, PRIMARY_COLOR, getStandardChartLayout, toChartTimes } from './chart-common';

export function EndChart() {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const show = planner.getDiveSegments().length > 2;

  const data = useMemo<Plotly.Data[]>(() => {
    const endData = planner.getENDChartData();
    const x = toChartTimes(endData.map(d => d.time));

    return [
      {
        x,
        y: endData.map(d => d.end),
        type: 'scatter',
        mode: 'lines',
        name: 'END',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.0f}m`,
      },
      {
        x,
        y: endData.map(d => d.errorLimit),
        type: 'scatter',
        mode: 'lines',
        name: 'Error Limit',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot',
          width: 2,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version]);

  const layout = useMemo<Partial<Plotly.Layout>>(() => {
    const result = getStandardChartLayout('Equivalent Narcotic Depth');
    result.yaxis = { ...result.yaxis, rangemode: 'tozero', zeroline: false };
    return result;
  }, []);

  return <ChartCard data={data} layout={layout} show={show} />;
}
