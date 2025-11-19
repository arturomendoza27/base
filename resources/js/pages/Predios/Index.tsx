import { BreadcrumbItem, Filters, PaginatedData, Predio } from '@/types';
import React, { useState } from 'react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { can } from '@/lib/can';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { EditIcon, EyeIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatoPesos } from '@/lib/fomato_numeros';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Predios',
    href: '/predios',
  },
];



interface IndexProps {
  datos: PaginatedData<Predio>;
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

    router.get('/predios', queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  }
  {/* Handle Delete */ }
  const handleDeleteConfirm = () => {
    if (idToDelete) {
      setTarifa(tarifa.filter((t) => t.id !== idToDelete))
      router.delete(`/predios/${idToDelete}`, {
        preserveScroll: true,
      });
      setIdToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleClear = () => {
    setData({
      search: '',
    })

    const queryString = {}

     router.get('/predios', queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión del Predio</h1>
            <p className="text-muted-foreground">Administra los predios</p>
          </div>
          <div className="flex space-x-2">
            {can('predios.import') && (
              <Button
                type="button"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                onClick={() => (window.location.href = '/predios/import')}
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
            {can('predios.export') && (
              <Button
                type="button"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                onClick={() => (window.location.href = '/predios/export')}
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
            {can('predios.create') && (
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-900 cursor-pointer transition"
                onClick={() => (window.location.href = '/predios/create')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nuevo Predio
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Predios</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type='text'
                  name='search'
                  placeholder="Buscar predios..."
                  onChange={handleSearchChange}
                  value={data.search}
                  className="pl-10"
                />
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cod Predio</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Matricula</TableHead>
                    <TableHead>Direccion</TableHead>
                    <TableHead>Ruta</TableHead>
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
                            <div className="font-medium">{dato.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.cliente.nombre}</div>
                            <div className="text-sm text-muted-foreground">Código Cliente: {dato.cliente.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.matricula_predial}</div>
                            <div className="text-sm text-muted-foreground"> Cat: {dato.categoria.nombre}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.direccion_predio}</div>
                            <div className="text-sm text-muted-foreground">{dato.barrio.nombre}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">{dato.ruta}</div>
                        </TableCell>
                        <TableCell>
                          {dato.estado_servicio === "activo" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Activo
                            </span>
                          ) : dato.estado_servicio === "suspendido" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Suspendido
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Desconectado
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
                              {can('predios.show') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/predios/${dato.id}`}
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('predios.edit') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/predios/${dato.id}/edit`}
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