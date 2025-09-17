/** @format */

'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import clsx from 'clsx';

export default function BarChartCard({
  title,
  data,
  colors = ['#4CAF50', '#FF5722', '#2196F3'],
  className,
  height = 300,
}) {
  return (
    <div
      className={clsx(
        'bg-bg border border-highlight p-6 rounded shadow',
        className
      )}
    >
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]} // ✅ cycle through colors
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
