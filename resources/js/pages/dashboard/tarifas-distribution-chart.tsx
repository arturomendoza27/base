"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface TarifasDistributionChartProps {
  data?: Array<{name: string, value: number, color: string}>;
}

export function TarifasDistributionChart({ data }: TarifasDistributionChartProps) {
  // Datos de ejemplo si no hay datos reales
  const chartData = data || [
    { name: "Residencial Básica", value: 1847, color: "hsl(var(--chart-1))" },
    { name: "Residencial Premium", value: 543, color: "hsl(var(--chart-2))" },
    { name: "Comercial Pequeña", value: 287, color: "hsl(var(--chart-3))" },
    { name: "Comercial Grande", value: 98, color: "hsl(var(--chart-4))" },
    { name: "Institucional", value: 72, color: "hsl(var(--chart-5))" },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Predios por Categoría</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total: {total.toLocaleString()} predios conectados
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Predios",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label={(entry: any) => {
                  const percent = entry.percent as number;
                  return `${entry.name}: ${(percent * 100).toFixed(1)}%`;
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [value.toLocaleString(), "Predios"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium">
                {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
