'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminCharts({ data }: { data: any[] }) {
  return (
    <Card className='shadow-sm border-none bg-white'>
      <CardHeader>
        <CardTitle className='text-sm font-bold uppercase text-gray-500'>
          New Dealer Signups (30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className='h-[350px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <XAxis
              dataKey='date'
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px' }}
            />
            <Bar
              dataKey='count'
              fill='#4f46e5'
              radius={[4, 4, 0, 0]}
              name='New Dealers'
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
