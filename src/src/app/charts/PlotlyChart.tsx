import { useEffect, useRef } from 'react';
import * as Plotly from 'plotly.js-basic-dist-min';

interface Props {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  config: Partial<Plotly.Config>;
  className?: string;
}

export function PlotlyChart({ data, layout, config, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Plotly.react acts like newPlot on first call and efficiently updates afterwards.
    // The layout is cloned because Plotly mutates it and the same layout object is
    // shared between the inline chart and its enlarged dialog view.
    Plotly.react(ref.current, data, structuredClone(layout), config);
  }, [data, layout, config]);

  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) Plotly.purge(el);
    };
  }, []);

  return <div ref={ref} className={className} />;
}
