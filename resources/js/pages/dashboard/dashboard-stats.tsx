import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, HomeIcon, FileTextIcon, TrendingUpIcon, AlertCircleIcon, CheckCircleIcon, DollarSignIcon, PercentIcon } from "lucide-react"

interface DashboardStatsProps {
  data?: {
    totalClientes: number;
    clientesActivos: number;
    totalPredios: number;
    prediosConectados: number;
    prediosSuspendidos: number;
    facturasPendientes: number;
    facturasVencidas: number;
    facturasPagadas: number;
    ingresosMesActual: number;
    totalFacturadoMes: number;
    tasaCobranza: number;
  };
}

export function DashboardStats({ data }: DashboardStatsProps) {
  // Si no hay datos, mostrar datos de ejemplo
  if (!data) {
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
    ];

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
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Clientes Activos",
      value: data.clientesActivos.toLocaleString(),
      subtitle: `de ${data.totalClientes} total`,
      changeType: "positive" as const,
      icon: UsersIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Predios Conectados",
      value: data.prediosConectados.toLocaleString(),
      subtitle: `${data.prediosSuspendidos} suspendidos`,
      changeType: data.prediosSuspendidos > 0 ? "negative" as const : "positive" as const,
      icon: HomeIcon,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Facturas Pendientes",
      value: data.facturasPendientes.toLocaleString(),
      subtitle: `${data.facturasVencidas} vencidas`,
      changeType: data.facturasVencidas > 0 ? "negative" as const : "positive" as const,
      icon: FileTextIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Ingresos del Mes",
      value: formatCurrency(data.ingresosMesActual),
      subtitle: `Tasa cobranza: ${data.tasaCobranza}%`,
      changeType: data.tasaCobranza > 80 ? "positive" as const : "negative" as const,
      icon: TrendingUpIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            <p className="text-xs text-muted-foreground mt-2">
              <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                {stat.changeType === "positive" ? "✓ " : "⚠ "}
                {stat.changeType === "positive" ? "En buen estado" : "Requiere atención"}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
