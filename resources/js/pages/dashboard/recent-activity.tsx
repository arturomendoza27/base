import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "María González",
    action: "Registró lectura de medidor",
    details: "Medidor #4521 - 245 m³",
    time: "Hace 2 horas",
    type: "reading",
  },
  {
    id: 2,
    user: "Carlos Rodríguez",
    action: "Generó factura",
    details: "Factura #2024-0156 - $45,230",
    time: "Hace 3 horas",
    type: "billing",
  },
  {
    id: 3,
    user: "Ana Martínez",
    action: "Actualizó datos de usuario",
    details: "Usuario ID: 1847",
    time: "Hace 5 horas",
    type: "user",
  },
  {
    id: 4,
    user: "Luis Herrera",
    action: "Procesó pago",
    details: "Factura #2024-0145 - $32,150",
    time: "Hace 1 día",
    type: "payment",
  },
]

const getActivityBadge = (type: string) => {
  switch (type) {
    case "reading":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Lectura
        </Badge>
      )
    case "billing":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Facturación
        </Badge>
      )
    case "user":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Usuario
        </Badge>
      )
    case "payment":
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          Pago
        </Badge>
      )
    default:
      return <Badge variant="outline">General</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.user}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
