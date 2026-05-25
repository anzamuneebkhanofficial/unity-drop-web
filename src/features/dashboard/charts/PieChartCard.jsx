/** @format */
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';
const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: '#0f0f0f',
  borderColor: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  color: '#fff',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
};
const TOOLTIP_ITEM_STYLE = { color: '#fff', fontSize: '14px', fontWeight: 'bold' };
const TOOLTIP_CURSOR = { fill: 'rgba(255,255,255,0.05)' };
const LEGEND_WRAPPER_STYLE = {
  paddingTop: '24px',
  fontSize: '11px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export default function PieChartCard({
  title,
  data,
  colors = ['#4CAF50', '#FF5722', '#2196F3'],
  className,
  height = 300,
}) {
  return (
    <div className={clsx('w-full h-full flex flex-col', className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-donor animate-pulse shadow-[0_0_8px_rgba(231,77,42,0.8)]" />
        <h2 className="text-sm font-black text-white italic tracking-widest uppercase">{title}</h2>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="75%"
            paddingAngle={5}
            dataKey="value"
            label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || colors[index % colors.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            itemStyle={TOOLTIP_ITEM_STYLE}
            cursor={TOOLTIP_CURSOR}
          />
          <Legend
            wrapperStyle={LEGEND_WRAPPER_STYLE}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}