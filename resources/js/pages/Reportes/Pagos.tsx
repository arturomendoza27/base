import ReporteBase from "./ReporteBase"

export default function ReportePagos() {
  return (
    <ReporteBase
      titulo="Reporte de Pagos / Recaudo"
      descripcion="Análisis de pagos recibidos por método de pago y período"
      endpoint="reportes/pagos"
      camposFiltro={[
        {
          nombre: "medio_pago",
          etiqueta: "Método de Pago",
          tipo: "select",
          opciones: [
            { valor: "efectivo", etiqueta: "Efectivo" },
            { valor: "transferencia", etiqueta: "Transferencia" },
            { valor: "tarjeta", etiqueta: "Tarjeta" },
            { valor: "cheque", etiqueta: "Cheque" },
          ],
        },
      ]}
    />
  )
}
