import { Link, router } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';

export default function Show({ log }) {
    return (
        <DashboardLayout>
             <div className="space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Logs</h1>
                        <p className="text-muted-foreground">Registros de la aplicación</p>
                    </div>
                </div>

            <button
                onClick={() => router.visit(`/log`)}
                   className="text-blue-600 hover:underline"
            >
                Ver
            </button>
           
            <div className="mt-4 bg-white p-4 rounded shadow">

                <h2 className="text-xl font-bold mb-2">{log.description}</h2>

                <p><strong>Tipo:</strong> {log.log_name}</p>
                <p><strong>Fecha:</strong> {log.created_at}</p>
                <p><strong>Usuario:</strong> {log.causer?.name ?? "N/A"}</p>

                <h3 className="font-bold mt-4">Datos</h3>

                <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                    {JSON.stringify(log.properties, null, 2)}
                </pre>

            </div>
        </div>
        </DashboardLayout>
    );
}
