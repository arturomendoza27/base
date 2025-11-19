import { Button } from '@/components/ui/button';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { CicloFacturacion, Cliente, MetricasCiclos, Tarifa, type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircleIcon, ArrowLeftIcon, CheckCircle2Icon, ClockIcon, DollarSignIcon, ListStartIcon } from 'lucide-react';
import clientes from '../../routes/clientes/index';
import { formatoPesos } from '@/lib/fomato_numeros';
import CardMetricas from './Card/CardMetricas';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ciclo',
        href: '/ciclos',
    },
    {
        title: 'Show',
        href: '#',
    },
];

interface ShowProps {
    datos: MetricasCiclos;

}

export default function Show({ datos }: ShowProps) {
    console.log(datos)
    return (
        <DashboardLayout>
            {/* <Head title={`Ciclo: ${datos.nombre}`} /> */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/ciclos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Ciclo {datos.ciclo}</h1>
                        <p className="text-muted-foreground">Informacion detallada</p>
                    </div>
                </div>


                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Facturas Pagas */}

                    <CardMetricas title="Pagos realizados" color="green" count={datos.numero_pagadas} amount={datos.valor_pagadas} Icon={DollarSignIcon} />
                    <CardMetricas title="Abonos realizados" color="blue" count={datos.numero_abonadas} amount={datos.valor_abonadas} Icon={CheckCircle2Icon} />
                    <CardMetricas title="Facturas Vencidas" color="yellow" count={datos.numero_vencidas} amount={datos.valor_vencidas} Icon={ClockIcon} />
                    <CardMetricas title="Suspendidos" color="red" count={datos.numero_suspendidas} amount={datos.valor_suspendidas} Icon={AlertCircleIcon} />
                </div>



            </div>
        </DashboardLayout>
    );
}

