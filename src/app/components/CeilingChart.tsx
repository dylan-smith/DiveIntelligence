'use client';

import React, { useMemo } from 'react';
import { Paper } from '@mui/material';
import dynamic from 'next/dynamic';
import { useDivePlanner } from '../contexts/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';
const NEW_DEPTH_COLOR = 'red';

interface CeilingChartProps {
  timeAtDepth: number;
}

export default function CeilingChart({ timeAtDepth }: CeilingChartProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const currentDepth = divePlanner.getCurrentDepth();
  const currentGas = divePlanner.getCurrentGas();

  const chartData = useMemo(() => {
    const ceilingData = divePlanner.getCeilingChartData(currentDepth, currentGas);
    const x = ceilingData.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = ceilingData.map(d => d.ceiling);

    return [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Ceiling',
        line: {
          color: PRIMARY_COLOR,
          width: 2,
        },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
  }, [currentDepth, currentGas, divePlanner, updateTrigger]);

  const getCeilingChartLayout = (): Partial<Plotly.Layout> => {
    return {
      autosize: true,
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

  return (
    <Paper elevation={2} sx={{ p: 1 }}>
      <Plot
        data={chartData}
        layout={getCeilingChartLayout()}
        config={getChartOptions()}
        style={{ width: '100%', height: '300px' }}
      />
    </Paper>
  );
}
