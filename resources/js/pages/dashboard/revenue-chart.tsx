"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"

interface RevenueChartProps {
  data?: Array<{month: string, revenue: number}>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Datos de ejemplo si no hay datos reales
  const chartData = data || [
    { month: "Ene", revenue: 98500 },
    { month: "Feb", revenue: 105300 },
    { month: "Mar", revenue: 112200 },
    { month: "Abr", revenue: 108800 },
    { month: "May", revenue: 119600 },
    { month: "Jun", revenue: 127450 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / chartData.length;
  const lastMonthRevenue = chartData[chartData.length - 1]?.revenue || 0;
  const previousMonthRevenue = chartData[chartData.length - 2]?.revenue || 0;
  const growthRate = previousMonthRevenue > 0 
    ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>Ingresos por facturación en los últimos meses</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <div className={`text-sm ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate >= 0 ? '↗' : '↘'} {Math.abs(growthRate).toFixed(1)}% vs mes anterior
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.1}
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--chart-2))"
              strokeWidth={3}
              dot={{ 
                fill: "hsl(var(--chart-2))", 
                strokeWidth: 2, 
                r: 4,
                stroke: "hsl(var(--background))"
              }}
              activeDot={{ 
                r: 6, 
                stroke: "hsl(var(--background))",
                strokeWidth: 3 
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Promedio Mensual</div>
            <div className="text-lg font-semibold">{formatCurrency(averageRevenue)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Último Mes</div>
            <div className="text-lg font-semibold">{formatCurrency(lastMonthRevenue)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Crecimiento</div>
            <div className={`text-lg font-semibold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
