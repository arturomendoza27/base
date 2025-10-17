import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, DollarSignIcon, FileTextIcon, TrendingUpIcon } from "lucide-react"

const stats = [
  {
    title: "Usuarios Activos",
    value: "2,847",
    change: "+12%",
    changeType: "positive" as const,
    icon: UsersIcon,
  },
  {
    title: "Tarifas Configuradas",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: DollarSignIcon,
  },
  {
    title: "Facturas Pendientes",
    value: "156",
    change: "-23%",
    changeType: "positive" as const,
    icon: FileTextIcon,
  },
  {
    title: "Ingresos del Mes",
    value: "$127,450",
    change: "+15%",
    changeType: "positive" as const,
    icon: TrendingUpIcon,
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
