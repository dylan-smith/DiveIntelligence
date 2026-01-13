'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box, Paper } from '@mui/material';
import { useDivePlanner } from '@/context/DivePlannerContext';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const PRIMARY_COLOR = '#3F51B5';
const TISSUE_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#E74C3C', '#C9CBCF', '#7BC225', '#1ABC9C',
  '#C45850', '#4D5360', '#949FB1', '#8E5EA2', '#3CBA9F', '#F39C12'
];

export default function TissuesPN2Chart() {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const segments = divePlanner.getDiveSegments();
  
  const showChart = segments.length > 2;

  const chartData = useMemo(() => {
    if (!showChart) return null;
    
    const data = divePlanner.getTissuesPN2ChartData();
    const x = data.map(d => new Date(1970, 1, 1, 0, 0, d.time, 0));
    const gasPN2 = data.map(d => d.gasPN2);

    const traces: Plotly.Data[] = [
      {
        x,
        y: gasPN2,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Gas PN2',
        line: { color: PRIMARY_COLOR, width: 3 },
        hovertemplate: `%{y:.2f}`,
      },
    ];

    for (let i = 0; i < 16; i++) {
      traces.push({
        x,
        y: data.map(d => d.tissuesPN2[i]),
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: `Tissue ${i + 1}`,
        line: { color: TISSUE_COLORS[i], width: 1 },
        hovertemplate: `%{y:.2f}`,
      });
    }

    return traces;
  }, [divePlanner, showChart, updateTrigger]);

  const layout = {
    autosize: true,
    showlegend: false,
    title: { text: 'Tissue PN2', y: 0.98 },
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
