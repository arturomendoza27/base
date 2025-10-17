import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DashboardLayout } from './dashboard/dashboard-layout';
import { DashboardStats } from './dashboard/dashboard-stats';
import { TarifasDistributionChart } from './dashboard/tarifas-distribution-chart';
import { RevenueChart } from './dashboard/revenue-chart';
import { RecentActivity } from './dashboard/recent-activity';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {

 return (
    //  <AppLayout breadcrumbs={breadcrumbs}>
                // <Head title="Two-Factor Authentication" />
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Panel de Control</h1>
          <p className="text-muted-foreground">Resumen general del sistema de facturación del acueducto</p>
        </div>

        <DashboardStats />

        <div className="grid gap-6 md:grid-cols-2">
          <TarifasDistributionChart />
          <RevenueChart  />
        </div>

        <RecentActivity />
      </div>
    </DashboardLayout>
        // </AppLayout>
  );

   
}
