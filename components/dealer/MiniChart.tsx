'use client';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function MiniChart({ data }: { data: any[] }) {
  return (
    <div className='h-32 w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='miniGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
              <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey='views'
            stroke='#3b82f6'
            strokeWidth={2}
            fill='url(#miniGradient)'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
