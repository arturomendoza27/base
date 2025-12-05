import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { can } from '@/lib/can';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { DashboardLayout } from './dashboard/dashboard-layout';
import { DashboardStats } from './dashboard/dashboard-stats';
import { TarifasDistributionChart } from './dashboard/tarifas-distribution-chart';
import { RevenueChart } from './dashboard/revenue-chart';
import { RecentActivity } from './dashboard/recent-activity';
import axios from 'axios';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardData {
    stats: {
        totalClientes: number;
        clientesActivos: number;
        totalPredios: number;
        prediosConectados: number;
        prediosSuspendidos: number;
        facturasPendientes: number;
        facturasVencidas: number;
        facturasPagadas: number;
        ingresosMesActual: number;
        totalFacturadoMes: number;
        tasaCobranza: number;
    };
    charts: {
        distribucionCategorias: Array<{name: string, value: number, color: string}>;
        distribucionPagos: Array<{name: string, value: number, total: number, color: string}>;
        ingresosUltimosMeses: Array<{month: string, revenue: number}>;
    };
    actividadReciente: Array<{
        id: number;
        description: string;
        subject_type: string;
        subject_id: number;
        causer_name: string;
        causer_type: string;
        properties: any;
        created_at: string;
        created_at_raw: string;
        type: string;
    }>;
    updatedAt: string;
}

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/dashboard/metrics');
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('No se pudieron cargar los datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Panel de Control</h1>
                        <p className="text-muted-foreground">Resumen general del sistema de facturación del acueducto</p>
                    </div>
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Cargando datos...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Panel de Control</h1>
                        <p className="text-muted-foreground">Resumen general del sistema de facturación del acueducto</p>
                    </div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                                <span className="text-destructive">!</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-destructive">Error al cargar datos</h3>
                                <p className="text-sm text-muted-foreground">{error}</p>
                                <button 
                                    onClick={fetchDashboardData}
                                    className="mt-2 text-sm text-primary hover:underline"
                                >
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Panel de Control</h1>
                        <p className="text-muted-foreground">Resumen general del sistema de facturación del acueducto</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Actualizado: {dashboardData ? new Date(dashboardData.updatedAt).toLocaleString('es-CO') : 'N/A'}
                    </div>
                </div>

                <DashboardStats data={dashboardData?.stats} />

                <div className="grid gap-6 md:grid-cols-2">
                    <TarifasDistributionChart data={dashboardData?.charts.distribucionCategorias} />
                    <RevenueChart data={dashboardData?.charts.ingresosUltimosMeses} />
                </div>
                {can('log.view') && (
                <RecentActivity activities={dashboardData?.actividadReciente} />
                )}
            </div>
        </DashboardLayout>
    );
}
