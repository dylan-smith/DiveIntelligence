import { useMemo } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';
import { useDivePlanner, useDivePlannerVersion } from '../dive-planner-service/dive-planner.store';
import { ChartCard } from './ChartCard';
import { PRIMARY_COLOR, getStandardChartLayout, toChartTimes } from './chart-common';

export function TissuesPn2Chart() {
  const planner = useDivePlanner();
  const version = useDivePlannerVersion();

  const show = planner.getDiveSegments().length > 2;

  const data = useMemo<Plotly.Data[]>(() => {
    const chartData = planner.getTissuesPN2ChartData();
    const x = toChartTimes(chartData.map(d => d.time));

    const tissueTraces: Plotly.Data[] = [];

    for (let i = 1; i <= 16; i++) {
      tissueTraces.push({
        x,
        y: chartData.map(d => d.tissuesPN2[i - 1]),
        type: 'scatter',
        mode: 'lines',
        name: `Tissue ${i} PN2`,
        line: {
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      });
    }

    return [
      {
        x,
        y: chartData.map(d => d.gasPN2),
        type: 'scatter',
        mode: 'lines',
        name: 'Gas PN2',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.2f}`,
      },
      ...tissueTraces,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planner, version]);

  const layout = useMemo<Partial<Plotly.Layout>>(() => {
    const result = getStandardChartLayout('Tissues PN<sub>2</sub> vs Gas PN<sub>2</sub>');
    result.yaxis = { ...result.yaxis, rangemode: 'tozero', zeroline: false };
    return result;
  }, []);

  return <ChartCard data={data} layout={layout} show={show} />;
}
