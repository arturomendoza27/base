import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, User, FileText, DollarSign, Home, Settings, AlertCircle, CheckCircle } from "lucide-react"

interface RecentActivityProps {
  activities?: Array<{
    id: number;
    description: string;
    subject_type: string;
    subject_id: number;
    causer_name: string;
    causer_type: string;
    properties: any;
    created_at: string;
    created_at_raw: string;
    type: string;
  }>;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'created':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'updated':
      return <Settings className="h-4 w-4 text-blue-600" />;
    case 'deleted':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case 'auth':
      return <User className="h-4 w-4 text-purple-600" />;
    case 'payment':
      return <DollarSign className="h-4 w-4 text-emerald-600" />;
    case 'billing':
      return <FileText className="h-4 w-4 text-amber-600" />;
    case 'client':
      return <User className="h-4 w-4 text-cyan-600" />;
    case 'property':
      return <Home className="h-4 w-4 text-indigo-600" />;
    default:
      return <Activity className="h-4 w-4 text-gray-600" />;
  }
};

const getActivityBadge = (type: string) => {
  switch (type) {
    case "created":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Creación
        </Badge>
      )
    case "updated":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Actualización
        </Badge>
      )
    case "deleted":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          Eliminación
        </Badge>
      )
    case "auth":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Autenticación
        </Badge>
      )
    case "payment":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          Pago
        </Badge>
      )
    case "billing":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          Facturación
        </Badge>
      )
    case "client":
      return (
        <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
          Cliente
        </Badge>
      )
    case "property":
      return (
        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
          Predio
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          General
        </Badge>
      )
  }
}

const formatActivityDescription = (description: string, properties: any) => {
  // Intentar extraer información útil de las propiedades
  if (properties && properties.attributes) {
    const attrs = properties.attributes;
    if (description.includes('created')) {
      return `Creó ${getSubjectName(description)}`;
    } else if (description.includes('updated')) {
      return `Actualizó ${getSubjectName(description)}`;
    } else if (description.includes('deleted')) {
      return `Eliminó ${getSubjectName(description)}`;
    }
  }
  
  // Descripciones en español más amigables
  const desc = description.toLowerCase();
  if (desc.includes('login')) return 'Inició sesión en el sistema';
  if (desc.includes('logout')) return 'Cerró sesión del sistema';
  if (desc.includes('factura')) return 'Generó una factura';
  if (desc.includes('pago')) return 'Registró un pago';
  if (desc.includes('cliente')) return 'Gestionó información de cliente';
  if (desc.includes('predio')) return 'Gestionó información de predio';
  
  return description;
};

const getSubjectName = (description: string) => {
  if (description.includes('Cliente')) return 'un cliente';
  if (description.includes('Facturacion')) return 'una factura';
  if (description.includes('Pago')) return 'un pago';
  if (description.includes('Predio')) return 'un predio';
  if (description.includes('User')) return 'un usuario';
  return 'un registro';
};

const getActivityDetails = (properties: any, type: string) => {
  if (!properties || !properties.attributes) return null;
  
  const attrs = properties.attributes;
  
  switch (type) {
    case 'client':
      if (attrs.nombre) return `Cliente: ${attrs.nombre}`;
      if (attrs.email) return `Email: ${attrs.email}`;
      break;
    case 'billing':
    case 'payment':
      if (attrs.total_factura) return `Monto: $${attrs.total_factura.toLocaleString()}`;
      if (attrs.valor_pagado) return `Pagado: $${attrs.valor_pagado.toLocaleString()}`;
      break;
    case 'property':
      if (attrs.direccion_predio) return `Dirección: ${attrs.direccion_predio}`;
      break;
  }
  
  return null;
};

export function RecentActivity({ activities }: RecentActivityProps) {
  // Datos de ejemplo si no hay actividades reales
  const displayActivities = activities || [
    {
      id: 1,
      description: "Usuario inició sesión",
      subject_type: "User",
      subject_id: 1,
      causer_name: "María González",
      causer_type: "User",
      properties: null,
      created_at: "Hace 2 horas",
      created_at_raw: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: "auth"
    },
    {
      id: 2,
      description: "Factura creada",
      subject_type: "Facturacion",
      subject_id: 156,
      causer_name: "Carlos Rodríguez",
      causer_type: "User",
      properties: { attributes: { total_factura: 45230 } },
      created_at: "Hace 3 horas",
      created_at_raw: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      type: "billing"
    },
    {
      id: 3,
      description: "Cliente actualizado",
      subject_type: "Clientes",
      subject_id: 1847,
      causer_name: "Ana Martínez",
      causer_type: "User",
      properties: { attributes: { nombre: "Juan Pérez", email: "juan@example.com" } },
      created_at: "Hace 5 horas",
      created_at_raw: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      type: "client"
    },
    {
      id: 4,
      description: "Pago registrado",
      subject_type: "Pagos",
      subject_id: 145,
      causer_name: "Luis Herrera",
      causer_type: "User",
      properties: { attributes: { valor_pagado: 32150 } },
      created_at: "Hace 1 día",
      created_at_raw: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: "payment"
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const details = getActivityDetails(activity.properties, activity.type);
            
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{activity.causer_name}</p>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatActivityDescription(activity.description, activity.properties)}
                  </p>
                  {details && (
                    <p className="text-xs text-muted-foreground">{details}</p>
                  )}
                  {activity.subject_type && activity.subject_id && (
                    <p className="text-xs text-muted-foreground">
                      {activity.subject_type.replace('App\\Models\\', '')} #{activity.subject_id}
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.created_at}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}
