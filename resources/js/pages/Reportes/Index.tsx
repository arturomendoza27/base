import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, DollarSign, AlertTriangle, CreditCard, PowerOff, WifiOff, Download } from "lucide-react"
import { Link } from "@inertiajs/react"
import { DashboardLayout } from "../dashboard/dashboard-layout"

const reportes = [
  {
    id: "facturacion",
    title: "Reporte de Facturación",
    description: "Reporte detallado de facturas emitidas, pagadas, pendientes y vencidas",
    icon: FileText,
    color: "bg-blue-500",
    route: "/reportes/facturacion",
  },
  {
    id: "pagos",
    title: "Reporte de Pagos / Recaudo",
    description: "Análisis de pagos recibidos por método de pago y período",
    icon: DollarSign,
    color: "bg-green-500",
    route: "/reportes/pagos",
  },
  {
    id: "cartera-vencida",
    title: "Reporte de Cartera Vencida",
    description: "Facturas vencidas clasificadas por días de mora",
    icon: AlertTriangle,
    color: "bg-red-500",
    route: "/reportes/cartera-vencida",
  },
  {
    id: "caja",
    title: "Reporte de Caja",
    description: "Movimientos diarios de caja y saldos acumulados",
    icon: CreditCard,
    color: "bg-purple-500",
    route: "/reportes/caja",
  },
  {
    id: "suspendidos",
    title: "Reporte de Suspendidos",
    description: "Predios con servicio suspendido y tiempo de suspensión",
    icon: PowerOff,
    color: "bg-amber-500",
    route: "/reportes/suspendidos",
  },
  {
    id: "desconectados",
    title: "Reporte de Desconectados",
    description: "Predios desconectados permanentemente o nunca conectados",
    icon: WifiOff,
    color: "bg-gray-500",
    route: "/reportes/desconectados",
  },
]

export default function ReportesIndex() {
  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Reportes del Sistema</h1>
        <p className="text-muted-foreground">
          Genera y visualiza reportes detallados del sistema de acueducto
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportes.map((reporte) => (
          <Card key={reporte.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${reporte.color} text-white`}>
                  <reporte.icon className="h-6 w-6" />
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={reporte.route}>
                    <Download className="h-4 w-4 mr-2" />
                    Ver
                  </Link>
                </Button>
              </div>
              <CardTitle className="mt-4">{reporte.title}</CardTitle>
              <CardDescription>{reporte.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Filtros avanzados por fecha</li>
                  <li>• Estadísticas detalladas</li>
                  <li>• Exportación a PDF/Excel</li>
                  <li>• Datos en tiempo real</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exportación Masiva</CardTitle>
          <CardDescription>
            Exporta múltiples reportes en diferentes formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todos (PDF)
            </Button>
            <Button className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todos (Excel)
            </Button>
            <Button className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Programar Reportes
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Los reportes se generan con los datos más recientes del sistema. 
            Puedes aplicar filtros específicos en cada reporte individual.
          </p>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  )
}
