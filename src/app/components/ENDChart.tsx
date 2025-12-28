'use client';

import React from 'react';
import { Paper } from '@mui/material';
import dynamic from 'next/dynamic';
import { useDivePlanner } from '../contexts/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';
const ERROR_COLOR = 'red';

export default function ENDChart() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const getShowGraphs = () => {
    return divePlanner.getDiveSegments().length > 2;
  };

  const getENDChartData = () => {
    const endData = divePlanner.getENDChartData();
    const x = endData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = endData.map(d => d.end);
    const errorLimit = endData.map(d => d.errorLimit);

    return [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'END',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.0f}m`,
      },
      {
        x,
        y: errorLimit,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Error Limit',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot' as const,
          width: 2,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
  };

  const getENDChartLayout = (): Partial<Plotly.Layout> => {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Equivalent Narcotic Depth',
        y: 0.98,
      },
      margin: { l: 35, r: 10, b: 30, t: 20, pad: 10 },
      xaxis: {
        fixedrange: true,
        tickformat: '%H:%M:%S',
      },
      yaxis: {
        fixedrange: true,
        rangemode: 'tozero',
        zeroline: false,
      },
      hovermode: 'x unified',
      hoverlabel: {
        bgcolor: 'rgba(200, 200, 200, 0.4)',
        bordercolor: 'rgba(200, 200, 200, 0.4)',
      },
    };
  };

  const getChartOptions = (): Partial<Plotly.Config> => {
    return {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      autosizable: true,
      scrollZoom: false,
      editable: false,
    };
  };

  if (!getShowGraphs()) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 1, mb: 2 }}>
      <Plot
        data={getENDChartData()}
        layout={getENDChartLayout()}
        config={getChartOptions()}
        style={{ width: '100%', height: '300px' }}
      />
    </Paper>
  );
}
