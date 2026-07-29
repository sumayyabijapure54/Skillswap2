import React from 'react';

// Hand-rolled, dependency-free SVG charts styled to match the app's accent
// gradient — avoids pulling in recharts/chart.js as a new dependency while
// still giving a "premium dashboard" data-viz feel.

export function MiniBarChart({ data, height = 140, valueKey = 'value', labelKey = 'label' }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="mini-chart mini-bar-chart" style={{ height }}>
      {data.map((d, i) => (
        <div className="mini-bar-col" key={i}>
          <div className="mini-bar" style={{ height: `${(d[valueKey] / max) * 100}%` }} title={`${d[labelKey]}: ${d[valueKey]}`} />
          <span>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

export function MiniLineChart({ data, height = 140, valueKey = 'value', labelKey = 'label' }) {
  const width = 100 / Math.max(data.length - 1, 1);
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const min = Math.min(...data.map(d => d[valueKey]), 0);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = i * width;
    const y = 100 - ((d[valueKey] - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="mini-chart" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mini-line-svg">
        <defs>
          <linearGradient id="miniLineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="miniLineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent2)" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#miniLineFill)" />
        <polyline points={points} fill="none" stroke="url(#miniLineStroke)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mini-chart-labels">
        {data.map((d, i) => <span key={i}>{d[labelKey]}</span>)}
      </div>
    </div>
  );
}
