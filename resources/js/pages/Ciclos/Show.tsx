import { Button } from '@/components/ui/button';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Cliente, Tarifa, type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import clientes from '../../routes/clientes/index';
import { TarifasDistributionChart } from '../dashboard/tarifas-distribution-chart';
import { formatoPesos } from '@/lib/fomato_numeros';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tarifas',
        href: '/tarifas',
    },
    {
        title: 'Show',
        href: '#',
    },
];

interface ShowProps {
    datos: Tarifa;

}

export default function Show({ datos }: ShowProps) {
    return (
        <DashboardLayout>
            <Head title={`Tarifa: ${datos.nombre}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/tarifas">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Tarifa</h1>
                        <p className="text-muted-foreground">Informacion detallada la Tarifa</p>
                    </div>
                </div>

                <div className="p-6 max-w-4xl mx-auto">


                    <div className="bg-white shadow-md rounded-xl p-8 space-y-6">
                        <div className="border-b pb-4">
                            <h1 className="text-2xl font-bold text-gray-900"> {datos.nombre}</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ID
                                </label>
                                <p className="text-gray-900">{datos.id}</p>
                            </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor Tarifa
                                </label>
                                <p className="text-gray-900">{formatoPesos(datos.valor)}</p>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor Conexión (punto)
                                </label>
                                <p className="text-gray-900">{formatoPesos(datos.valor_conexion)}</p>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Valor Reconexión
                                </label>
                                <p className="text-gray-900">{formatoPesos(datos.valor_reconexion)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <p className="text-gray-900">
                                    {datos.estado === "activa" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Activa
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Incativa
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Created At
                                </label>
                                <p className="text-gray-900">
                                    {new Date(datos.created_at).toLocaleDateString('es', {
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
                                    {new Date(datos.updated_at).toLocaleDateString('es', {
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

