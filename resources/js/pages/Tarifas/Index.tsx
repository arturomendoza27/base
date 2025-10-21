import { BreadcrumbItem, Cliente, Filters, PaginatedData, Tarifa } from '@/types';
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { can } from '@/lib/can';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { EditIcon, EyeIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatoPesos } from '@/lib/fomato_numeros';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tarifas',
    href: '/tarifas',
  },
];



interface IndexProps {
  datos: PaginatedData<Tarifa>;
  filters: Filters;
}



export default function Index({ datos, filters }: IndexProps) {
  const [tarifa, setTarifa] = useState(datos.data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  // Filter users based on search term
  const { data, setData } = useForm({
    search: filters.search || '',
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value.toLowerCase()
    setData('search', userInput)
    const queryString = userInput ? { search: userInput } : {}

    router.get('/tarifas', queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  }
  {/* Handle Delete */ }
  const handleDeleteConfirm = () => {
    if (idToDelete) {
      setTarifa(tarifa.filter((t) => t.id !== idToDelete))
      router.delete(`/tarifas/${idToDelete}`, {
        preserveScroll: true,
      });
      setIdToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de las Tarifas</h1>
            <p className="text-muted-foreground">Administra las tarifas</p>
          </div>
          <div className="flex space-x-2">
            {can('tarifas.create') && (
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-900 cursor-pointer transition"
                onClick={() => (window.location.href = '/tarifas/create')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nueva Tarifa
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Tarifas</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type='text'
                  name='search'
                  placeholder="Buscar tarifas..."
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datos.data.length > 0 ? (
                    datos.data.map((dato) => (
                      <TableRow key={dato.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.nombre}</div>

                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{formatoPesos(dato.valor)}</div>
                        </TableCell>
                        <TableCell>
                          {dato.estado === "activa" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Activa
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Incativa
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {can('tarifas.show') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/tarifas/${dato.id}`}
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('tarifas.edit') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/tarifas/${dato.id}/edit`}
                                    className="flex items-center"
                                  >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('tarifas.delete') && (
                                <DropdownMenuItem asChild>
                                  <button
                                    onClick={() => {
                                      setIdToDelete(dato.id)
                                      setDeleteDialogOpen(true)
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
                      <TableCell colSpan={4} className="text-center py-4">
                        Datos no encontrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {datos.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url ?? '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 mx-1 text-sm rounded border
                  ${link.active ? 'bg-accent-foreground text-white' : 'bg-white text-gray-700'}
                  ${!link.url ? 'pointer-events-none opacity-50' : 'hover:vbg-gray-100'}`} />
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
              Esta acción no se puede deshacer. La tarifa sera eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </DashboardLayout >
  );

}