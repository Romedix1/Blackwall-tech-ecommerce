'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type OrdersChartProps = {
  data: { label: string; amount: number }[]
}

export const OrdersChart = ({ data }: OrdersChartProps) => {
  return (
    <div className="bg-surface flex h-100 w-full flex-col border p-6">
      <h2 className="text-text-second mb-6 w-full text-sm font-bold tracking-widest uppercase">
        <span className="sr-only">Orders chart for past 30 days</span>
        <span
          aria-hidden="true"
          className="inline-block w-full wrap-break-word"
        >
          <span className="mr-2">{'//'}</span>
          Revenue_trajectory_30_days
        </span>
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            stroke="var(--color-text-second)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fontFamily: 'monospace' }}
            dy={10}
          />

          <YAxis
            stroke="var(--color-text-second)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fontFamily: 'monospace' }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border))',
              borderRadius: '4px',
              fontSize: '12px',
            }}
            itemStyle={{ color: 'var(--color-accent)' }}
            cursor={{
              stroke: 'var(--color-accent)',
              strokeWidth: 1,
              strokeOpacity: 0.3,
            }}
            labelStyle={{
              fontSize: '12px',
              color: 'var(--color-text-second)',
              marginBottom: '4px',
            }}
          />

          <Line
            type="monotone"
            name="Orders"
            dataKey="amount"
            stroke="var(--color-accent)"
            strokeWidth={2}
            dot={{
              fill: '#000',
              stroke: 'var(--color-accent)',
              strokeWidth: 2,
              r: 3,
            }}
            activeDot={{
              r: 5,
              strokeWidth: 0,
              fill: 'var(--color-accent)',
            }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
