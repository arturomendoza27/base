import { Link, router } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, CalendarIcon, UserIcon, FileTextIcon, DatabaseIcon, TagIcon, CodeIcon, InfoIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Log {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ShowProps {
  log: Log;
}

export default function Show({ log }: ShowProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getLogTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      default: 'bg-gray-100 text-gray-800',
      created: 'bg-green-100 text-green-800',
      updated: 'bg-blue-100 text-blue-800',
      deleted: 'bg-red-100 text-red-800',
      login: 'bg-purple-100 text-purple-800',
      logout: 'bg-indigo-100 text-indigo-800',
    };
    return colors[type.toLowerCase()] || colors.default;
  };

  const formatProperties = (properties: Record<string, any>) => {
    if (!properties || Object.keys(properties).length === 0) {
      return [];
    }

    interface FormattedProperty {
      key: string;
      value: any;
      type: string;
      rawValue: any;
    }

    const formatted: FormattedProperty[] = [];
    
    // Procesar propiedades anidadas
    const processObject = (obj: any, prefix = '', depth = 0) => {
      if (depth > 2) return; // Limitar profundidad para evitar recursión infinita
      
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          processObject(value, fullKey, depth + 1);
        } else {
          let displayValue = value;
          
          if (value === null) displayValue = 'null';
          else if (value === undefined) displayValue = 'undefined';
          else if (typeof value === 'boolean') displayValue = value ? 'Sí' : 'No';
          else if (Array.isArray(value)) displayValue = `[${value.length} elementos]`;
          else if (typeof value === 'string') {
            // Intentar parsear JSON si parece ser JSON
            if (value.startsWith('{') || value.startsWith('[')) {
              try {
                const parsed = JSON.parse(value);
                if (typeof parsed === 'object') {
                  displayValue = `JSON (${Object.keys(parsed).length} propiedades)`;
                }
              } catch {
                // No es JSON válido, mostrar como texto
              }
            }
          }
          
          formatted.push({
            key: fullKey,
            value: displayValue,
            type: Array.isArray(value) ? 'array' : typeof value,
            rawValue: value
          });
        }
      }
    };

    processObject(properties);
    return formatted;
  };

  const formattedProperties = formatProperties(log.properties);
  const hasProperties = formattedProperties.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header con navegación */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.visit('/log')}
                className="gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Volver a registros
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-balance">Detalle del Registro</h1>
            <p className="text-muted-foreground">Información completa del evento registrado en el sistema</p>
          </div>
          
          <Badge className={getLogTypeColor(log.log_name)} variant="outline">
            {log.log_name}
          </Badge>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Información básica */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Descripción del Evento
                </CardTitle>
                <CardDescription>
                  Acción registrada en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium p-4 bg-accent/30 rounded-lg">
                  {log.description}
                </p>
              </CardContent>
            </Card>

            {/* Propiedades del evento */}
            {hasProperties && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DatabaseIcon className="h-5 w-5" />
                    Propiedades del Evento
                    <Badge variant="secondary" className="ml-2">
                      {formattedProperties.length} {formattedProperties.length === 1 ? 'propiedad' : 'propiedades'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Datos específicos asociados a este registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formattedProperties.map((prop, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-accent/20 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <TagIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm font-medium bg-accent/50 px-2 py-1 rounded">
                                {prop.key}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {prop.type}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              {prop.type === 'object' || prop.type === 'array' ? (
                                <div className="text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <InfoIcon className="h-3 w-3" />
                                    <span>Contenido complejo - ver JSON completo</span>
                                  </div>
                                  <pre className="text-xs bg-accent/30 p-3 rounded overflow-x-auto mt-2">
                                    {JSON.stringify(prop.rawValue, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <CodeIcon className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {String(prop.value)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* JSON completo (opcional) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon className="h-5 w-5" />
                  JSON Completo
                </CardTitle>
                <CardDescription>
                  Representación completa en formato JSON para desarrolladores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-accent/30 p-4 rounded-lg overflow-x-auto max-h-96">
                  {JSON.stringify(log.properties, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha - Metadatos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <InfoIcon className="h-5 w-5" />
                  Información del Registro
                </CardTitle>
                <CardDescription>
                  Metadatos del evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">ID</span>
                    <span className="font-mono font-bold">#{log.id}</span>
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Fecha y Hora
                    </span>
                    <span className="text-sm font-medium">{formatDateTime(log.created_at)}</span>
                  </div>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Tipo de Evento</span>
                    <Badge className={getLogTypeColor(log.log_name)}>
                      {log.log_name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Información del Usuario
                </CardTitle>
                <CardDescription>
                  Usuario que realizó la acción
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {log.causer ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Nombre</span>
                      <span className="text-sm font-medium">{log.causer.name}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Email</span>
                      <span className="text-sm font-medium">{log.causer.email}</span>
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">ID Usuario</span>
                      <span className="font-mono text-sm">#{log.causer.id}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-muted-foreground mb-2">Acción realizada por el sistema</div>
                    <Badge variant="outline">Sistema</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del Subject */}
            {(log.subject_type || log.subject_id) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DatabaseIcon className="h-5 w-5" />
                    Recurso Afectado
                  </CardTitle>
                  <CardDescription>
                    Elemento del sistema relacionado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {log.subject_type && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Tipo</span>
                      <span className="text-sm font-medium">
                        {log.subject_type.replace('App\\Models\\', '')}
                      </span>
                    </div>
                  )}
                  {log.subject_id && (
                    <>
                      {log.subject_type && <Separator />}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">ID</span>
                        <span className="font-mono text-sm font-bold">#{log.subject_id}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
