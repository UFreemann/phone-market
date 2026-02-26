'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function AnalyticsCharts({
  data,
  topProducts,
  periodLabel,
}: {
  data: any[];
  topProducts: any[];
  periodLabel: string;
}) {
  // Format dates for X-Axis (e.g. "Mar 10")
  const chartData = data.map((d) => ({
    ...d,
    formattedDate: format(new Date(d.date), 'MMM d'),
  }));

  return (
    <div className='space-y-8'>
      {/* ROW 1: TRAFFIC OVERVIEW */}
      <Card className='border-none shadow-sm bg-white'>
        <CardHeader>
          <CardTitle className='text-sm font-bold uppercase tracking-wider text-gray-500'>
            Traffic Overview ({periodLabel})
          </CardTitle>
        </CardHeader>
        <CardContent className='h-[350px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='colorViews' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#8b5cf6' stopOpacity={0} />
                </linearGradient>
                <linearGradient id='colorLeads' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#22c55e' stopOpacity={0.8} />
                  <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey='formattedDate'
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <CartesianGrid
                vertical={false}
                strokeDasharray='3 3'
                opacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type='monotone'
                dataKey='views'
                stroke='#8b5cf6'
                fillOpacity={1}
                fill='url(#colorViews)'
                strokeWidth={2}
                name='Profile Views'
              />
              <Area
                type='monotone'
                dataKey='leads'
                stroke='#22c55e'
                fillOpacity={1}
                fill='url(#colorLeads)'
                strokeWidth={2}
                name='Leads'
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ROW 2: TOP PRODUCTS */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <Card className='border-none shadow-sm bg-white'>
          <CardHeader>
            <CardTitle className='text-sm font-bold uppercase tracking-wider text-gray-500'>
              Top Performing Products (By Leads)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className='text-gray-400 text-sm text-center py-10'>
                No data available yet.
              </p>
            ) : (
              <div className='space-y-4'>
                {topProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-gray-400 font-bold text-sm w-4'>
                        {i + 1}
                      </span>
                      <div className='h-10 w-10 bg-gray-100 rounded overflow-hidden'>
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            className='w-full h-full object-cover'
                          />
                        )}
                      </div>
                      <p className='text-sm font-medium text-gray-900 line-clamp-1'>
                        {product.title}
                      </p>
                    </div>
                    <span className='text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded'>
                      {product._count.leads} Leads
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* You can add another chart here later (e.g., Conversion Rate) */}
        <Card className='border-none shadow-sm bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex flex-col justify-center items-center text-center p-8'>
          <h3 className='text-2xl font-bold mb-2'>Grow your Traffic</h3>
          <p className='text-purple-100 mb-6 max-w-xs'>
            Use the "Sponsored Ads" feature to boost your products to the top of
            the homepage.
          </p>

          {/* LINK TO AD MANAGER */}
          <Link href='/dashboard/ads'>
            <Button className='bg-white text-purple-700 px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform border-none hover:bg-gray-50'>
              Request Promotion
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
