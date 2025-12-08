import ReporteBase from "./ReporteBase"

export default function ReporteCarteraVencida() {
  return (
    <ReporteBase
      titulo="Reporte de Cartera Vencida"
      descripcion="Facturas vencidas clasificadas por días de mora"
      endpoint="reportes/cartera-vencida"
      camposFiltro={[
        {
          nombre: "dias_mora_min",
          etiqueta: "Días Mora Mínimo",
          tipo: "number",
        },
        {
          nombre: "dias_mora_max",
          etiqueta: "Días Mora Máximo",
          tipo: "number",
        },
        {
          nombre: "estado",
          etiqueta: "Estado",
          tipo: "select",
          opciones: [
            { valor: "vigente", etiqueta: "Vigente" },
            { valor: "cancelada", etiqueta: "Cancelada" },
            { valor: "en_cobro", etiqueta: "En Cobro" },
          ],
        },
      ]}
    />
  )
}
