'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box, Paper, Typography } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';
const ERROR_COLOR = 'red';

export default function DepthChart() {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const segments = divePlanner.getDiveSegments();
  
  const showChart = segments.length > 2;

  const chartData = useMemo(() => {
    if (!showChart) return null;
    
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
  }, [divePlanner, showChart, updateTrigger]);

  const layout = {
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
      autorange: 'reversed' as const,
    },
    hovermode: 'x unified' as const,
    hoverlabel: {
      bgcolor: 'rgba(200, 200, 200, 0.4)',
      bordercolor: 'rgba(200, 200, 200, 0.4)',
    },
  };

  const config = {
    responsive: true,
    displaylogo: false,
    displayModeBar: false,
  };

  if (!showChart) {
    return null;
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ height: 300 }}>
        {chartData && (
          <Plot
            data={chartData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>
    </Paper>
  );
}
