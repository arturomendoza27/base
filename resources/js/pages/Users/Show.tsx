import { Button } from '@/components/ui/button';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Show',
        href: '#',
    },
]; 

interface ShowProps {
    user: User;
    userRoles: string[];
    userPermissions: string[];
}

export default function Show({ user, userRoles, userPermissions }: ShowProps) {
    return (
        <DashboardLayout>
             <Head title={`Usuario: ${user.name}`} />
             <div className="space-y-6">
               <div className="flex items-center gap-4">
                    <Link href="/users">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Usuarios</h1>
                        <p className="text-muted-foreground">Informacion detallada del usuario</p>
                    </div>
                </div>
           
            <div className="p-6 max-w-4xl mx-auto">
             

                <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
                    <div className="border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Detalle usuario</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                ID
                            </label>
                            <p className="text-gray-900">{user.id}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Verified
                            </label>
                            <p className="text-gray-900">
                                {user.email_verified_at ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Not Verified
                                    </span>
                                )}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <p className="text-gray-900">{user.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Created At
                            </label>
                            <p className="text-gray-900">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Updated At
                            </label>
                            <p className="text-gray-900">
                                {new Date(user.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Roles
                        </label>
                        {userRoles && userRoles.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userRoles.map((role, index) => (
                                    <span
                                        key={index}
                                        className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No roles assigned</p>
                        )}
                    </div>

                    <div className="border-t pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Permissions (via Roles)
                        </label>
                        {userPermissions && userPermissions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {userPermissions.map((permission, index) => (
                                    <span
                                        key={index}
                                        className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700"
                                    >
                                        {permission}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No permissions</p>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </DashboardLayout>
    );
}

