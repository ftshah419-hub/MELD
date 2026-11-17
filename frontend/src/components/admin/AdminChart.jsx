import React from 'react';

/**
 * Line Trend Area Chart
 */
export function LineChart({
  data = [],
  height = 200,
  strokeColor = '#164b3b',
  fillColor = 'rgba(22, 75, 59, 0.08)',
  xKey = 'label',
  yKey = 'value'
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        No historical trend data available
      </div>
    );
  }

  const values = data.map((d) => Number(d[yKey]) || 0);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 10);
  const range = maxVal - minVal || 1;

  const width = 600;
  const padding = 30;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * innerWidth;
    const y = height - padding - ((Number(d[yKey]) - minVal) / range) * innerHeight;
    return { x, y, label: d[xKey], value: d[yKey] };
  });

  const pathD = points.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', maxHeight: height, overflow: 'visible' }}
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - padding - pct * innerHeight;
          const val = Math.round(minVal + pct * range);
          return (
            <g key={idx}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="var(--border)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding - 6}
                y={y + 3}
                textAnchor="end"
                fontSize="10"
                fill="var(--text-subtle)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Gradient Fill */}
        <path d={areaD} fill={fillColor} />

        {/* Stroke Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#ffffff"
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* X Labels */}
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="var(--text-muted)"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Bar Chart for Categorical or Module Distributions
 */
export function BarChart({ data = [], height = 180, color = 'var(--primary)' }) {
  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No distribution data</div>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height, paddingTop: '1rem' }}>
      {data.map((item, idx) => {
        const heightPct = Math.round((item.value / max) * 100);
        return (
          <div
            key={idx}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              height: '100%',
              justifyContent: 'flex-end'
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text)' }}>
              {item.value}
            </span>
            <div
              style={{
                width: '100%',
                maxHeight: '100%',
                height: `${Math.max(heightPct, 6)}%`,
                backgroundColor: item.color || color,
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.4s ease'
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '70px'
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Micro Sparkline
 */
export function MiniSparkline({ points = [5, 12, 10, 18, 14, 22, 28], color = 'var(--primary)' }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const w = 70;
  const h = 28;

  const pts = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * w;
    const y = h - ((val - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
}

export default { LineChart, BarChart, MiniSparkline };
