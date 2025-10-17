import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import { can } from '@/lib/can';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditIcon, EyeIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { type BreadcrumbItem, type PaginatedData, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';




const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/users',
  },
];

interface IndexProps {
  users: PaginatedData<User>;
}




export default function Index({ users }: IndexProps) {

  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUsers] = useState(users.data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const filteredUsers = users.data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(user.filter((t) => t.id !== userToDelete))
      router.delete(`/users/${userToDelete}`, {
        preserveScroll: true,
      });
      setUserToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios del sistema de acueducto</p>
          </div>
          {can('users.create') && (
            <Link
              href="/users/create"
              className="inline-block mb-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded px-4 py-2 transition"
            >
              <PlusIcon className="w-4 h-4 mr-2 inline" />
              Nuevo Usuario
            </Link>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    <TableHead>Rol</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>


                  {users.data.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        {/* <TableCell className="text-sm">{user.email}</TableCell> */}
                        <TableCell>
                          {user.roles && user.roles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (

                                <code key={role.id} className="bg-muted px-2 py-1 rounded text-sm"> {role.name}</code>

                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">No roles</span>
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
                              {can('users.show') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/users/${user.id}`}
                                    className="flex items-center"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('users.edit') && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/users/${user.id}/edit`}
                                    className="flex items-center"
                                  >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {can('users.delete') && (
                                <DropdownMenuItem asChild>
                                  <button
                                    onClick={() => {
                                      setUserToDelete(user.id)
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
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-wrap items-center justify-center gap-1">
                {users.links.map((link, index) => (
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
              Esta acción no se puede deshacer. EL usuario será eliminado permanentemente del sistema.
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

