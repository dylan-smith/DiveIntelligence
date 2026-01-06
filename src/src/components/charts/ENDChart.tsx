'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box, Paper } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';
const ERROR_COLOR = 'red';

export default function ENDChart() {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const segments = divePlanner.getDiveSegments();
  
  const showChart = segments.length > 2;

  const chartData = useMemo(() => {
    if (!showChart) return null;
    
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
        line: { color: PRIMARY_COLOR, width: 3 },
        hovertemplate: `%{y:.0f}m`,
      },
      {
        x,
        y: errorLimit,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Error Limit',
        line: { color: ERROR_COLOR, width: 2, dash: 'dash' as const },
        hovertemplate: `%{y:.0f}m`,
      },
    ];
  }, [divePlanner, showChart, updateTrigger]);

  const layout = {
    autosize: true,
    showlegend: false,
    title: { text: 'Equivalent Narcotic Depth', y: 0.98 },
    margin: { l: 35, r: 10, b: 30, t: 20, pad: 10 },
    xaxis: { fixedrange: true, tickformat: '%H:%M:%S' },
    yaxis: { fixedrange: true },
    hovermode: 'x unified' as const,
  };

  const config = {
    responsive: true,
    displaylogo: false,
    displayModeBar: false,
  };

  if (!showChart) return null;

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
