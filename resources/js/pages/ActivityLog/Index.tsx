import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DashboardLayout } from '../dashboard/dashboard-layout';

export default function Index({ logs, types, filters }) {

    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "");
    const [from, setFrom] = useState(filters.from || "");
    const [to, setTo] = useState(filters.to || "");

    const submit = () => {
        router.get('/log', {
            search,
            type,
            from,
            to
        }, { preserveState: true });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Logs</h1>
                        <p className="text-muted-foreground">Registros de la aplicación</p>
                    </div>
                </div>




                {/* FILTROS */}
                <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">

                    <input
                        className="border rounded p-2"
                        placeholder="Buscar..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <select
                        className="border rounded p-2"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="">Todos los tipos</option>
                        {types.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        className="border rounded p-2"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                    />

                    <input
                        type="date"
                        className="border rounded p-2"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                    />

                    <button
                        onClick={submit}
                        className="md:col-span-4 bg-blue-600 text-white p-2 rounded"
                    >
                        Filtrar
                    </button>
                </div>

                {/* TABLA */}
                <div className="bg-white shadow rounded overflow-x-auto">
                    <table className="w-full table-auto text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Fecha</th>
                                <th className="p-2">Tipo</th>
                                <th className="p-2">Descripción</th>
                                <th className="p-2">Usuario</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map(log => (
                                <tr key={log.id} className="border-b">
                                    <td className="p-2">{log.created_at}</td>
                                    <td className="p-2">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                            {log.log_name}
                                        </span>
                                    </td>
                                    <td className="p-2">{log.description}</td>
                                    <td className="p-2">{log.causer?.name ?? 'N/A'}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => router.visit(`/log/${log.id}`)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACION */}
                <div className="mt-4 flex gap-2">
                    {logs.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || ""}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-2 py-1 border rounded ${link.active ? 'bg-blue-600 text-white' : ''}`}
                        />
                    ))}
                </div>

            </div>
        </DashboardLayout>
    );
}
