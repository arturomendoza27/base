import ReporteBase from "./ReporteBase"

export default function ReporteSuspendidos() {
  return (
    <ReporteBase
      titulo="Reporte de Suspendidos"
      descripcion="Predios con servicio suspendido y tiempo de suspensión"
      endpoint="reportes/suspendidos"
      camposFiltro={[]}
    />
  )
}
