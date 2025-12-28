'use client';

import React from 'react';
import { Paper } from '@mui/material';
import dynamic from 'next/dynamic';
import { useDivePlanner } from '../contexts/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';

export default function TissuesPN2Chart() {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const getShowGraphs = () => {
    return divePlanner.getDiveSegments().length > 2;
  };

  const getTissuesPN2ChartData = () => {
    const pn2Data = divePlanner.getTissuesPN2ChartData();
    const x = pn2Data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));

    const tissueTraces: Plotly.Data[] = [];

    for (let i = 1; i <= 16; i++) {
      tissueTraces.push({
        x,
        y: pn2Data.map(d => d.tissuesPN2[i - 1]),
        type: 'scatter' as const,
        mode: 'lines' as const,
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
        y: pn2Data.map(d => d.gasPN2),
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Gas PN2',
        line: {
          color: PRIMARY_COLOR,
          width: 5,
        },
        hovertemplate: `%{y:.2f}`,
      },
      ...tissueTraces,
    ];
  };

  const getTissuesPN2ChartLayout = (): Partial<Plotly.Layout> => {
    return {
      autosize: true,
      showlegend: false,
      title: {
        text: 'Tissues PN2',
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
        data={getTissuesPN2ChartData()}
        layout={getTissuesPN2ChartLayout()}
        config={getChartOptions()}
        style={{ width: '100%', height: '300px' }}
      />
    </Paper>
  );
}
