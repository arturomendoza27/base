import { BreadcrumbItem, Pago } from '@/types';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarIcon, DollarSignIcon, FileTextIcon, UserIcon, HomeIcon, CreditCardIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatoPesos } from '@/lib/fomato_numeros';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pagos',
    href: '/pagos',
  },
  {
    title: 'Detalles del Pago',
    href: '#',
  },
];

interface ShowProps {
  pago: Pago;
}

export default function Show({ pago }: ShowProps) {
  const factura = pago.factura;
  const predio = factura?.predio;
  const cliente = predio?.cliente;
  const ciclo = factura?.ciclo;

  return (
    <DashboardLayout>
      <Head title={`Detalles del Pago #${pago.id}`} />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pagos">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Detalles del Pago</h1>
            <p className="text-muted-foreground">Información completa del pago #{pago.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del Pago */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5" />
                Información del Pago
              </CardTitle>
              <CardDescription>Detalles del registro de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">ID del Pago</label>
                  <div className="text-lg font-semibold">#{pago.id}</div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Fecha del Pago</label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(pago.fecha_pago).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Valor Pagado</label>
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4 text-green-600" />
                    <span className="text-xl font-bold text-green-700">{formatoPesos(pago.valor_pagado)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Saldo Restante</label>
                  <div className={`flex items-center gap-2 ${pago.saldo_restante > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    <DollarSignIcon className="h-4 w-4" />
                    <span className="text-lg font-semibold">{formatoPesos(pago.saldo_restante)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Medio de Pago</label>
                  <div className="flex items-center gap-2">
                    <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline">{pago.medio_pago}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Estado de la Factura</label>
                  <div>
                    <Badge 
                      className={
                        factura?.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                        factura?.estado === 'abono' ? 'bg-amber-100 text-amber-800' :
                        factura?.estado === 'pendiente' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {factura?.estado?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {pago.recibo_numero && (
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-2">Información del Recibo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Número de Recibo</label>
                      <div className="font-medium">{pago.recibo_numero}</div>
                    </div>
                    
                    {pago.recibo_banco && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Banco</label>
                        <div className="font-medium">{pago.recibo_banco}</div>
                      </div>
                    )}
                    
                    {pago.recibo_fecha && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Fecha del Recibo</label>
                        <div className="font-medium">{new Date(pago.recibo_fecha).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información de la Factura y Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Información de la Factura
              </CardTitle>
              <CardDescription>Factura asociada a este pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Número de Factura</label>
                  <div className="font-bold text-lg">#{factura?.id}</div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Ciclo de Facturación</label>
                  <div className="font-medium">
                    {ciclo?.mes} {ciclo?.anio}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Total Factura</label>
                  <div className="font-bold text-lg">{formatoPesos(factura?.total_factura || 0)}</div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Concepto</label>
                  <div className="text-sm">{factura?.concepto}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Información del Cliente
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                    <div className="font-medium">{cliente?.nombre}</div>
                  </div>
                  
                  {cliente?.documento && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Documento</label>
                      <div className="font-medium">{cliente.documento}</div>
                    </div>
                  )}
                  
                  {cliente?.telefono && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <div className="font-medium">{cliente.telefono}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  Información del Predio
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                    <div className="font-medium">{predio?.direccion_predio}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Matrícula Predial</label>
                    <div className="font-medium">{predio?.matricula_predial}</div>
                  </div>
                  
                  {predio?.barrio && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Barrio</label>
                      <div className="font-medium">{predio.barrio.nombre}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/pagos">
            <Button variant="outline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
