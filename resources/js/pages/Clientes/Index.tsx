import { BreadcrumbItem, Cliente, Filters, PaginatedData } from '@/types';
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Clientes',
    href: '/clientes',
  },
];



interface IndexProps {
  clientes: PaginatedData<Cliente>;
  filters: Filters;
}

export default function Index({ clientes, filters }: IndexProps) {
  const [cliente, setCliente] = useState(clientes.data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
  // Filter users based on search term
  const { data, setData } = useForm({
    search: filters.search || ''
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value.toLowerCase()
    setData('search', userInput)
    const queryString = userInput ? { search: userInput } : {}

    router.get('/clientes', queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  }
  {/* Handle Delete */ }
  const handleDeleteConfirm = () => {
    if (idToDelete) {
      setCliente(cliente.filter((t) => t.id !== idToDelete))
      router.delete(`/clientes/${idToDelete}`, {
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
            <h1 className="text-3xl font-bold text-balance">Gestión de Clientes</h1>
            <p className="text-muted-foreground">Administra los clientes</p>
          </div>
          <div className="flex space-x-2">
            {can('clientes.import') && (
              <Button
                type="button"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                onClick={() => (window.location.href = '/clientes/import')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm4 8h8m-4 4v-8" />
                </svg>
                Importar
              </Button>
            )}
            {can('clientes.export') && (
              <Button
                type="button"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                onClick={() => (window.location.href = '/clientes/export')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
                </svg>
                Exportar
              </Button>
            )}
            {can('clientes.create') && (
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-900 cursor-pointer transition"
                onClick={() => (window.location.href = '/clientes/create')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nuevo Cliente
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type='text'
                  name='search'
                  placeholder="Buscar usuarios..."
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
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Celular</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.data.length > 0 ? (
                    clientes.data.map((dato) => (
                      <TableRow key={dato.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.nombre}</div>

                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{dato.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{dato.telefono}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{dato.direccion}</div>
                        </TableCell>
                        {/* <TableCell className="text-sm">{user.email}</TableCell> */}
                        {/* <TableCell>
                        {cliente.predios && cliente.predios.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {cliente.predios.map((predio) => (

                              <code key={predio.id} className="bg-muted px-2 py-1 rounded text-sm"> {predio.direccion_predio} - {predio.direccion_ruta} - {predio.estado} </code>

                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin predios asociados</span>
                        )}

                      </TableCell> */}

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {can('clientes.show') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/clientes/${dato.id}`}
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('clientes.edit') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/clientes/${dato.id}/edit`}
                                    className="flex items-center"
                                  >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('clientes.delete') && (
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
                        Clientes no encontrados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {clientes.links.map((link, index) => (
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
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente del sistema.
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