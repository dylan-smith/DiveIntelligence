'use client';

import React from 'react';
import { Paper, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useDivePlanner } from '../contexts/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';
const ERROR_COLOR = 'red';
const WARNING_COLOR = 'orange';

export default function PO2Chart() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const getShowGraphs = () => {
    return divePlanner.getDiveSegments().length > 2;
  };

  const getPO2ChartData = () => {
    const pO2Data = divePlanner.getPO2ChartData();
    const x = pO2Data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const y = pO2Data.map(d => d.pO2);
    const limit = pO2Data.map(d => d.limit);
    const decoLimit = pO2Data.map(d => d.decoLimit);
    const minLimit = pO2Data.map(d => d.min);

    return [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'PO2',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.2f}`,
      },
      {
        x,
        y: minLimit,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Min Limit (Hypoxia)',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot' as const,
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
      {
        x,
        y: limit,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Working Limit',
        marker: {
          color: WARNING_COLOR,
        },
        line: {
          dash: 'dot' as const,
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
      {
        x,
        y: decoLimit,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Deco Limit',
        marker: {
          color: ERROR_COLOR,
        },
        line: {
          dash: 'dot' as const,
          width: 2,
        },
        hovertemplate: `%{y:.2f}`,
      },
    ];
  };

  const getPO2ChartLayout = (): Partial<Plotly.Layout> => {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Gas PO2',
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
        data={getPO2ChartData()}
        layout={getPO2ChartLayout()}
        config={getChartOptions()}
        style={{ width: '100%', height: '300px' }}
      />
    </Paper>
  );
}
