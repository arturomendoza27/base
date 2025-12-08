import ReporteBase from "./ReporteBase"

export default function ReporteDesconectados() {
  return (
    <ReporteBase
      titulo="Reporte de Desconectados"
      descripcion="Predios desconectados permanentemente o nunca conectados"
      endpoint="reportes/desconectados"
      camposFiltro={[]}
    />
  )
}
