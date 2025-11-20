import { BreadcrumbItem, CicloFacturacion, Factura, Filters, PaginatedData, Predio } from '@/types';
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
import predios from '../../routes/predios/index';
import { Cliente } from '../../types/index';
import FacturaPdf from '@/components/factura-pdf';
import FacturaPdfMasiva from '@/components/factura-pdf-masiva';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Predios',
    href: '/predios',
  },
];



interface IndexProps {
  datos: PaginatedData<Factura>;
  filters: Filters;
}

export default function Index({ datos, filters }: IndexProps) {

  const [tarifa, setTarifa] = useState(datos.data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  // Filter users based on search term
  const { data, setData } = useForm({
    search: filters.search || '',
  });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value.toLowerCase()
    setData('search', userInput)
    const queryString = userInput ? { search: userInput } : {}

    router.get('/facturacion', queryString, {
      preserveState: true,
      preserveScroll: true,
    });
  }
  {/* Handle Delete */ }
  const handleDeleteConfirm = () => {
    if (idToDelete) {
      setTarifa(tarifa.filter((t) => t.id !== idToDelete))
      router.delete(`/facturar/${idToDelete}`, {
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

    router.get('/facturacion', queryString, {
      preserveState: true,
      preserveScroll: true,
    });


  }


  // const handleClick = async () => {
  //   if (loading) return;
  //   setLoading(true);

  //   try {
  //     const resp = await fetch("facturacion/facturar", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-CSRF-TOKEN": (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? "",
  //       },
  //       credentials: "same-origin",
  //       body: JSON.stringify({
  //         filtros: {
  //           rango_fecha: { desde: "2025-10-01", hasta: "2025-10-31" },
  //           tipo: "masiva",
  //         },
  //       }),
  //     });

  //     if (!resp.ok) throw new Error(`Error en servidor: ${resp.status}`);

  //     const data = await resp.json();
  //     console.log("Respuesta:", data);

  //     setTaskId(data.task_id || null);
  //     alert(data.message || "Facturación masiva iniciada.");
  //   } catch (e) {
  //     console.error("Error en handleClick:", e);
  //     alert("Error iniciando la facturación masiva. ");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de la Facturación</h1>
            <p className="text-muted-foreground">Administra la facturación agua de red</p>
          </div>
          <div className="flex space-x-2">
            {can('facturacion.export') && (
              <Button
                type="button"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 cursor-pointer"
                onClick={() => (window.location.href = '/facturacion/facturar')}
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
            {can('facturacion.create') && (
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-900 cursor-pointer transition"
                onClick={() => (window.location.href = '/facturacion/create')}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Facturar
              </Button>
            )}
  {can('facturacion.create') && (
            datos.data.length > 0 ? ( 
        
        <FacturaPdfMasiva cicloId={datos.data[0]?.ciclo_id}/>

      ) : (

        <Link
          as="button"
          href="/facturacion/facturar"
          className="bg-black text-white hover:bg-gray-900 cursor-pointer transition px-4 py-2 flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          {loading ? "Iniciando..." : "Generar facturación masiva"}
        </Link>

      ))}

          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista facturas emitidas para el mes </CardTitle> {/*obtener dato de ciclo de facturacion */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type='text'
                  name='search'
                  placeholder="Buscar facturas..."
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
                    <TableHead>No. Factura</TableHead>
                    <TableHead>Mes</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Direccion</TableHead>
                    <TableHead>Total</TableHead>
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
                            <div className="font-medium">{dato.ciclo.mes}</div>
                            <div className="text-sm text-muted-foreground"> {dato.ciclo.anio}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.predio.cliente.nombre}</div>
                            <div className="text-sm text-muted-foreground">Código Cliente: {dato.predio.cliente.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dato.predio.direccion_predio}</div>
                            <div className="text-sm text-muted-foreground"> Id: {dato.predio.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatoPesos(dato.total_factura)}</div>

                          </div>
                        </TableCell>
                        {/*'pendiente', 'pagada', 'vencida', 'anulada'*/}
                        <TableCell>
                          {dato.estado === "pendiente" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pendiente
                            </span>
                          ) : dato.estado === "pagada" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Pagada
                            </span>
                          ) : dato.estado === "vencida" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Vencida
                            </span>
                          ) : dato.estado === "abono" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Abono
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Anulada
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
                              {/* {can('facturacion.show') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/facturacion/${dato.id}`}
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              )} */}
                              {can('facturacion.show') && (
                                <DropdownMenuItem >
                                  <FacturaPdf
                                    predioId={dato.predio.id} />
                                </DropdownMenuItem>
                              )}

                              {can('facturacion.edit') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/facturacion/${dato.id}/edit`}
                                    className="flex items-center"
                                  >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('facturacion.delete') && (
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
  )

}