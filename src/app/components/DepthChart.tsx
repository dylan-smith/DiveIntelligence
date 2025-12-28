'use client';

import React from 'react';
import { Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useDivePlanner } from '../contexts/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5'; // Indigo 500
const ERROR_COLOR = 'red';

export default function DepthChart() {
  const { divePlanner } = useDivePlanner();

  const getShowGraphs = () => {
    return divePlanner.getDiveSegments().length > 2;
  };

  const getDepthChartData = () => {
    const depthData = divePlanner.getDepthChartData();
    const x = depthData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = depthData.map(d => d.depth);
    const y2 = depthData.map(d => d.ceiling);

    return [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Depth',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.0f}m`,
      },
      {
        x,
        y: y2,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Ceiling',
        fill: 'tozeroy' as const,
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot' as const,
          width: 0,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
  };

  const getDepthChartLayout = (): Partial<Plotly.Layout> => {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Depth vs Ceiling',
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
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography>Create dive segments to populate graphs</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 1, mb: 2 }}>
      <Plot
        data={getDepthChartData()}
        layout={getDepthChartLayout()}
        config={getChartOptions()}
        style={{ width: '100%', height: '300px' }}
      />
    </Paper>
  );
}
