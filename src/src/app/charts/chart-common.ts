import * as Plotly from 'plotly.js-basic-dist-min';

export const ERROR_COLOR = 'red';
export const WARNING_COLOR = 'orange';
export const PRIMARY_COLOR = '#3F51B5'; // Indigo 500

export const CHART_CONFIG: Partial<Plotly.Config> = {
  responsive: true,
  displaylogo: false,
  displayModeBar: false,
  autosizable: true,
  scrollZoom: false,
  editable: false,
};

export function toChartTimes(times: number[]): Date[] {
  return times.map(t => new Date(1970, 1, 1, 0, 0, t, 0));
}

export function getStandardChartLayout(titleText: string): Partial<Plotly.Layout> {
  return {
    autosize: true,
    showlegend: false,
    title: {
      text: titleText,
      y: 0.98,
    },
    margin: { l: 35, r: 10, b: 30, t: 20, pad: 10 },
    xaxis: {
      fixedrange: true,
      tickformat: '%H:%M:%S',
    },
    yaxis: {
      fixedrange: true,
    },
    hovermode: 'x unified',
    hoverlabel: {
      bgcolor: 'rgba(200, 200, 200, 0.4)',
      bordercolor: 'rgba(200, 200, 200, 0.4)',
    },
  };
}
