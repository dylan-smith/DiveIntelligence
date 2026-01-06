'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';

interface CeilingChartProps {
  timeAtDepth: number;
}

export default function CeilingChart({ timeAtDepth }: CeilingChartProps) {
  const { divePlanner, updateTrigger } = useDivePlanner();

  const currentDepth = divePlanner.getCurrentDepth();
  const currentGas = divePlanner.getCurrentGas();

  const chartData = useMemo(() => {
    const data = divePlanner.getCeilingChartData(currentDepth, currentGas);
    const x = data.map(d => Math.floor(d.time / 60)); // Convert to minutes
    const y = data.map(d => d.ceiling);

    return [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Ceiling',
        line: { color: PRIMARY_COLOR, width: 2 },
        hovertemplate: `%{y:.1f}m at %{x}min`,
      },
    ];
  }, [divePlanner, currentDepth, currentGas, updateTrigger]);

  const layout = {
    autosize: true,
    showlegend: false,
    title: { text: 'Ceiling Over Time at Current Depth', y: 0.98 },
    margin: { l: 45, r: 10, b: 40, t: 30, pad: 10 },
    xaxis: {
      fixedrange: true,
      title: { text: 'Time (minutes)' },
    },
    yaxis: {
      fixedrange: true,
      title: { text: 'Ceiling (m)' },
    },
    shapes: timeAtDepth > 0 ? [
      {
        type: 'line' as const,
        x0: timeAtDepth,
        y0: 0,
        x1: timeAtDepth,
        yref: 'paper' as const,
        y1: 1,
        line: {
          color: 'red',
          width: 2,
          dash: 'dash' as const,
        },
      },
    ] : [],
    hovermode: 'x unified' as const,
  };

  const config = {
    responsive: true,
    displaylogo: false,
    displayModeBar: false,
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Ceiling Projection
      </Typography>
      <Box sx={{ height: 300 }}>
        <Plot
          data={chartData}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
    </Box>
  );
}
