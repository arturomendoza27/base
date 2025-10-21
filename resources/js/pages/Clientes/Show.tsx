import { Button } from '@/components/ui/button';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Cliente, type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import clientes from '../../routes/clientes/index';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clientes',
    },
    {
        title: 'Show',
        href: '#',
    },
];

interface ShowProps {
    cliente: Cliente;

}

export default function Show({ cliente }: ShowProps) {
    return (
        <DashboardLayout>
            <Head title={`Cliente: ${cliente.nombre}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/clientes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Clientes</h1>
                        <p className="text-muted-foreground">Informacion detallada del cliente</p>
                    </div>
                </div>

                <div className="p-6 max-w-4xl mx-auto">


                    <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
                        <div className="border-b pb-4">
                            <h1 className="text-2xl font-bold text-gray-900"> {cliente.nombre}</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ID
                                </label>
                                <p className="text-gray-900">{cliente.id}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <p className="text-gray-900">
                                    {cliente.estado === "activo" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Incativo
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <p className="text-gray-900">{cliente.nombre}</p>
                            </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cédula
                                </label>
                                <p className="text-gray-900">{cliente.documento}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Celular
                                </label>
                                <p className="text-gray-900">{cliente.telefono}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <p className="text-gray-900">{cliente.email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dirección
                                </label>
                                <p className="text-gray-900">{cliente.direccion}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Created At
                                </label>
                                <p className="text-gray-900">
                                    {new Date(cliente.created_at).toLocaleDateString('es', {
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
                                    {new Date(cliente.updated_at).toLocaleDateString('es', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        

                       
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

