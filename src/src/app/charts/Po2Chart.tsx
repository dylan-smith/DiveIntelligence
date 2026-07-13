import { useMemo } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ChartCard } from './ChartCard';
import { ERROR_COLOR, WARNING_COLOR, PRIMARY_COLOR, getStandardChartLayout, toChartTimes } from './chart-common';

export function Po2Chart() {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const show = planner.getDiveSegments().length > 2;

  const data = useMemo<Plotly.Data[]>(() => {
    const pO2Data = planner.getPO2ChartData();
    const x = toChartTimes(pO2Data.map(d => d.time));

    return [
      {
        x,
        y: pO2Data.map(d => d.pO2),
        type: 'scatter',
        mode: 'lines',
        name: 'PO2',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.2f}`,
      },
      {
        x,
        y: pO2Data.map(d => d.min),
        type: 'scatter',
        mode: 'lines',
        name: 'Min Limit (Hypoxia)',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot',
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
      {
        x,
        y: pO2Data.map(d => d.limit),
        type: 'scatter',
        mode: 'lines',
        name: 'Working Limit',
        marker: {
          color: WARNING_COLOR,
        },
        line: {
          dash: 'dot',
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
      {
        x,
        y: pO2Data.map(d => d.decoLimit),
        type: 'scatter',
        mode: 'lines',
        name: 'Deco Limit',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot',
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version]);

  const layout = useMemo<Partial<Plotly.Layout>>(() => {
    const result = getStandardChartLayout('Gas PO2');
    result.yaxis = { ...result.yaxis, rangemode: 'tozero', zeroline: false };
    return result;
  }, []);

  return <ChartCard data={data} layout={layout} show={show} />;
}
