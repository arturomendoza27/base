"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Residencial Básica", value: 1847, color: "hsl(var(--chart-1))" },
  { name: "Residencial Premium", value: 543, color: "hsl(var(--chart-2))" },
  { name: "Comercial Pequeña", value: 287, color: "hsl(var(--chart-3))" },
  { name: "Comercial Grande", value: 98, color: "hsl(var(--chart-4))" },
  { name: "Institucional", value: 72, color: "hsl(var(--chart-5))" },
]

export function TarifasDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Usuarios por Tarifa</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Usuarios",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
