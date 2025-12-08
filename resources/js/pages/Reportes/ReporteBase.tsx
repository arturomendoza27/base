import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, RefreshCw, BarChart3, FileText } from "lucide-react"
import axios from "axios"
import { cn } from "@/lib/utils"

interface ReporteBaseProps {
  titulo: string
  descripcion: string
  endpoint: string
  camposFiltro?: Array<{
    nombre: string
    etiqueta: string
    tipo: "text" | "date" | "select" | "number"
    opciones?: Array<{ valor: string; etiqueta: string }>
  }>
}

export default function ReporteBase({ titulo, descripcion, endpoint, camposFiltro = [] }: ReporteBaseProps) {
  const [datos, setDatos] = useState<any>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<Record<string, any>>({})

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError(null)
      
      const params = new URLSearchParams()
      
      // Agregar otros filtros
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      const url = `/api/${endpoint}${params.toString() ? `?${params.toString()}` : ''}`
      const response = await axios.get(url)
      setDatos(response.data)
    } catch (err) {
      console.error('Error cargando reporte:', err)
      setError('No se pudieron cargar los datos del reporte')
    } finally {
      setCargando(false)
    }
  }

  const exportarReporte = async (formato: 'pdf' | 'excel') => {
    try {
      const response = await axios.post('/api/reportes/exportar', {
        tipo: endpoint.split('/')[1], // Extraer tipo del endpoint
        formato,
        ...filtros,
      })
      
      // En una implementación real, aquí se descargaría el archivo
      alert(`Reporte exportado exitosamente como ${formato.toUpperCase()}`)
      console.log('Datos de exportación:', response.data)
    } catch (err) {
      console.error('Error exportando reporte:', err)
      alert('Error al exportar el reporte')
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const limpiarFiltros = () => {
    setFiltros({})
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-balance">{titulo}</h1>
          <p className="text-muted-foreground">{descripcion}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={cargarDatos} disabled={cargando}>
            <RefreshCw className={cn("h-4 w-4 mr-2", cargando && "animate-spin")} />
            Actualizar
          </Button>
          <Button onClick={() => exportarReporte('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => exportarReporte('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtros</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </div>
          <CardDescription>Aplica filtros para refinar los resultados del reporte</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Campos de filtro dinámicos */}
            {camposFiltro.map((campo) => (
              <div key={campo.nombre} className="space-y-2">
                <Label htmlFor={campo.nombre}>{campo.etiqueta}</Label>
                {campo.tipo === "select" ? (
                  <Select
                    value={filtros[campo.nombre] || ""}
                    onValueChange={(value) => setFiltros({ ...filtros, [campo.nombre]: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Seleccionar ${campo.etiqueta.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {campo.opciones?.map((opcion) => (
                        <SelectItem key={opcion.valor} value={opcion.valor}>
                          {opcion.etiqueta}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={campo.nombre}
                    type={campo.tipo}
                    value={filtros[campo.nombre] || ""}
                    onChange={(e) => setFiltros({ ...filtros, [campo.nombre]: e.target.value })}
                    placeholder={`Ingresar ${campo.etiqueta.toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button onClick={cargarDatos} disabled={cargando}>
              <Filter className="h-4 w-4 mr-2" />
              Aplicar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de carga/error */}
      {cargando && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Cargando datos del reporte...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <span className="text-destructive">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-destructive">Error al cargar datos</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button 
                    onClick={cargarDatos}
                    className="mt-2"
                    size="sm"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas */}
      {datos?.estadisticas && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Estadísticas</CardTitle>
            </div>
            <CardDescription>Resumen general del reporte</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(datos.estadisticas).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="text-sm text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-2xl font-bold">
                    {typeof value === 'number' 
                      ? key.includes('total') || key.includes('valor') || key.includes('monto')
                        ? `$${value.toLocaleString('es-CO')}`
                        : value.toLocaleString('es-CO')
                      : String(value)
                    }
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Datos del reporte */}
      {datos && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>Datos del Reporte</CardTitle>
              </div>
              <div className="text-sm text-muted-foreground">
                {Array.isArray(datos[Object.keys(datos)[0]]) 
                  ? `${datos[Object.keys(datos)[0]].length} registros`
                  : 'Datos disponibles'
                }
              </div>
            </div>
            <CardDescription>
              Información detallada según los filtros aplicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <pre className="p-4 text-sm bg-muted/50 rounded">
                  {JSON.stringify(datos, null, 2)}
                </pre>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Nota: En una implementación completa, aquí se mostraría una tabla con los datos.
              Por ahora se muestran en formato JSON para verificación.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
