import ReporteBase from "./ReporteBase"

export default function ReporteFacturacion() {
  return (
    <ReporteBase
      titulo="Reporte de Facturación"
      descripcion="Reporte detallado de facturas emitidas, pagadas, pendientes y vencidas"
      endpoint="reportes/facturacion"
      camposFiltro={[
        {
          nombre: "estado",
          etiqueta: "Estado",
          tipo: "select",
          opciones: [
            { valor: "emitida", etiqueta: "Emitida" },
            { valor: "pagada", etiqueta: "Pagada" },
            { valor: "vencida", etiqueta: "Vencida" },
            { valor: "anulada", etiqueta: "Anulada" },
          ],
        },
        {
          nombre: "cliente_id",
          etiqueta: "ID Cliente",
          tipo: "number",
        },
      ]}
    />
  )
}
