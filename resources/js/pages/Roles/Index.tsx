import AppLayout from '@/layouts/app-layout';
import Pagination from '@/components/pagination';
import { can } from '@/lib/can';
import { type BreadcrumbItem, type PaginatedData, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '../dashboard/dashboard-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface IndexProps {
    roles: PaginatedData<Role>;
}

export default function Index({ roles }: IndexProps) {
    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`/roles/${id}`, {
                preserveScroll: true,
            });
        }
    }

    return (
      <DashboardLayout>
         <Head title="Roles" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">Gestión de Roles y Permisos</h1>
                    <p className="text-muted-foreground">Administra roles y permisos asignados a los usuarios</p>
                  </div>
                  {can('users.create') && (
                    <Link
                      href="/roles/create"
                      className="inline-flex items-center bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-md transition"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Nuevo Rol
                    </Link>
                  )}
                </div>
      
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Lista de Roles</CardTitle>
                 
              
                </CardHeader>
      
                <CardContent>
                    
           
            <div className="gap-4 rounded-xl p-4">
                
                <div className="">
                    <div className="flex flex-1 flex-col justify-center overflow-x-auto">
                        <table className="min-w-full flex-1 divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {roles.data.map((role) => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {role.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {role.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {role.permissions && role.permissions.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map((perm) => (
                                                        <span
                                                            key={perm.id}
                                                            className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 border border-gray-200"
                                                        >
                                                            {perm.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Sin permisos</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                            <div className="flex items-center gap-2">
                                                {can('roles.view') && (
                                                    <Link
                                                        href={`/roles/${role.id}`}
                                                        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-md transition"
                                                    >
                                                        Ver
                                                    </Link>
                                                )}
                                                {can('roles.edit') && (
                                                    <Link
                                                        href={`/roles/${role.id}/edit`}
                                                        className="inline-flex items-center px-3 py-1 text-sm bg-black text-white hover:bg-gray-900 rounded-md transition"
                                                    >
                                                        Editar
                                                    </Link>
                                                )}
                                                {can('roles.delete') && (
                                                    <button
                                                        onClick={() => handleDelete(role.id)}
                                                        className="inline-flex items-center px-3 py-1 text-sm bg-red-600 text-white hover:bg-red-700 rounded-md transition"
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={roles.links} />
                </div>
            </div>
            
        </CardContent>
                    </Card>
                 </div>   
      </DashboardLayout>
    );
}
