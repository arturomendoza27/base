import { DashboardLayout } from '../dashboard/dashboard-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, EditIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { can } from '@/lib/can';
import { getGroupedPermissions, transformPermissionName, type GroupedPermission } from '@/lib/permission-utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Detalles del Rol',
        href: '#',
    },
];

interface ShowProps {
    role: Role;
    rolePermissions: string[];
}

export default function Show({ role, rolePermissions }: ShowProps) {
    const groupedPermissions = rolePermissions && rolePermissions.length > 0 
        ? getGroupedPermissions(rolePermissions)
        : [];

    return (
        <DashboardLayout>
            <Head title={`Rol: ${role.name}`} />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/roles">
                            <Button variant="ghost" size="icon">
                                <ArrowLeftIcon className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-balance">Detalles del Rol</h1>
                            <p className="text-muted-foreground">Información detallada del rol: {role.name}</p>
                        </div>
                    </div>
                    {can('roles.edit') && (
                        <Link href={`/roles/${role.id}/edit`}>
                            <Button className="flex items-center gap-2">
                                <EditIcon className="h-4 w-4" />
                                Editar Rol
                            </Button>
                        </Link>
                    )}
                </div>
                
                <div className="p-6 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Rol</CardTitle>
                            <CardDescription>Detalles completos del rol en el sistema</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Información Básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">ID</Label>
                                    <p className="text-lg font-semibold">{role.id}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Nombre del Rol</Label>
                                    <p className="text-lg font-semibold text-primary">{role.name}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Guard Name</Label>
                                    <p className="text-lg">{role.guard_name}</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Cantidad de Permisos</Label>
                                    <p className="text-lg font-semibold">
                                        {rolePermissions ? rolePermissions.length : 0} permiso(s)
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Fecha de Creación</Label>
                                    <p className="text-lg">
                                        {new Date(role.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Última Actualización</Label>
                                    <p className="text-lg">
                                        {new Date(role.updated_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Permisos Asignados */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-medium">Permisos Asignados</Label>
                                    <Badge variant="outline">
                                        {rolePermissions ? rolePermissions.length : 0} permisos
                                    </Badge>
                                </div>
                                
                                {groupedPermissions.length > 0 ? (
                                    <div className="space-y-4">
                                        {groupedPermissions.map((group: GroupedPermission) => (
                                            <div key={group.resource} className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1 w-4 bg-primary rounded-full"></div>
                                                    <h3 className="font-medium text-sm text-gray-700">
                                                        {group.resourceLabel}
                                                    </h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pl-6">
                                                    {group.permissions.map((permission) => (
                                                        <div key={permission.name} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                            <span className="text-sm font-medium">{permission.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                        <p className="text-muted-foreground">No hay permisos asignados a este rol</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
