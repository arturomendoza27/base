import ReporteBase from "./ReporteBase"

export default function ReporteCaja() {
  return (
    <ReporteBase
      titulo="Reporte de Caja"
      descripcion="Movimientos diarios de caja y saldos acumulados"
      endpoint="reportes/caja"
      camposFiltro={[
        {
          nombre: "fecha",
          etiqueta: "Fecha",
          tipo: "date",
        },
      ]}
    />
  )
}
