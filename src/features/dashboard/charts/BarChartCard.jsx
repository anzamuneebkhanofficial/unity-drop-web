/** @format */
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import clsx from 'clsx';
const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: '#0f0f0f',
  borderColor: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  color: '#fff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};
const TOOLTIP_ITEM_STYLE = { color: '#fff', fontSize: '14px', fontWeight: 'bold' };
const TOOLTIP_CURSOR = { fill: 'rgba(255,255,255,0.02)' };
const LEGEND_WRAPPER_STYLE = {
  paddingTop: '24px',
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export default function BarChartCard({
  title,
  data,
  colors = ['#4CAF50', '#FF5722', '#2196F3'],
  className,
  height = 300,
}) {
  return (
    <div className={clsx('w-full h-full flex flex-col', className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-highlight/80 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
        <h2 className="text-sm font-black text-white italic tracking-widest uppercase">{title}</h2>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}
            tickMargin={10}
          />
          <YAxis
            stroke="rgba(255,255,255,0.1)"
            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            itemStyle={TOOLTIP_ITEM_STYLE}
            cursor={TOOLTIP_CURSOR}
          />
          <Legend
            wrapperStyle={LEGEND_WRAPPER_STYLE}
            iconType="circle"
          />
          <Bar dataKey="value" name="TOTAL COUNT" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}