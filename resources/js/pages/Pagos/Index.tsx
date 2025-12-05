import { BreadcrumbItem, Pago, Filters, PaginatedData } from '@/types';
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { can } from '@/lib/can';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { EyeIcon, MoreHorizontalIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatoPesos } from '@/lib/fomato_numeros';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Pagos',
    href: '/pagos',
  },
];

interface IndexProps {
  pagos: PaginatedData<Pago>;
  filters: Filters;
}

export default function Index({ pagos, filters }: IndexProps) {
  const [pagosList, setPagosList] = useState(pagos.data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  
  const { data, setData } = useForm({
    search: filters.search || ''
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value.toLowerCase();
    setData('search', userInput);
    const queryString = userInput ? { search: userInput } : {};

    router.get('/pagos', queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDeleteConfirm = () => {
    if (idToDelete) {
      setPagosList(pagosList.filter((p) => p.id !== idToDelete));
      router.delete(`/pagos/${idToDelete}`, {
        preserveScroll: true,
      });
      setIdToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <Head title="Gestión de Pagos" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div> 
            <h1 className="text-3xl font-bold text-balance">Gestión de Pagos</h1>
            <p className="text-muted-foreground">Administra los pagos registrados</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pagos</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type='text'
                  name='search'
                  placeholder="Buscar pagos..."
                  onChange={handleSearchChange}
                  value={data.search}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pago</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha Pago</TableHead>
                    <TableHead>Valor Pagado</TableHead>
                    <TableHead>Saldo Restante</TableHead>
                    <TableHead>Medio de Pago</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagos.data.length > 0 ? (
                    pagos.data.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell>
                          <div className="font-medium">{pago.id}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">Factura #{pago.factura_id}</div>
                            <div className="text-sm text-muted-foreground">
                              {pago.factura?.predio?.direccion_predio}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{pago.factura?.predio?.cliente?.nombre}</div>
                            <div className="text-sm text-muted-foreground">
                              {pago.factura?.predio?.cliente?.documento}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{pago.fecha_pago}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatoPesos(pago.valor_pagado)}</div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${pago.saldo_restante > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {formatoPesos(pago.saldo_restante)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{pago.medio_pago}</div>
                        
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {can('pagos.show') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/pagos/${pago.id}`}
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('pagos.delete') && (
                                <DropdownMenuItem asChild>
                                  <button
                                    onClick={() => {
                                      setIdToDelete(pago.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className="group flex w-full items-center text-red-600 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                                  >
                                    <TrashIcon className="h-4 w-4 mr-2 transition-colors duration-200 group-hover:text-red-700" />
                                    Eliminar
                                  </button>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No se encontraron pagos.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="flex flex-wrap items-center justify-center gap-1 p-4">
                {pagos.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url ?? '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 mx-1 text-sm rounded border
                      ${link.active ? 'bg-accent-foreground text-white' : 'bg-white text-gray-700'}
                      ${!link.url ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El pago será eliminado permanentemente y 
              el estado de la factura asociada será actualizado a "pendiente".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
