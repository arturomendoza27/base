import { Link, router, useForm } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Head } from '@inertiajs/react';
import { SearchIcon, FilterIcon, EyeIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Log {
  id: number;
  log_name: string;
  description: string;
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
}

interface IndexProps {
  logs: {
    data: Log[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  types: string[];
  filters: {
    search?: string;
    type?: string;
    from?: string;
    to?: string;
  };
}

export default function Index({ logs, types, filters }: IndexProps) {
  const { data, setData } = useForm({
    search: filters.search || '',
    type: filters.type || '',
    from: filters.from || '',
    to: filters.to || '',
  });

  const submit = () => {
    const params: any = {};
    if (data.search) params.search = data.search;
    if (data.type) params.type = data.type;
    if (data.from) params.from = data.from;
    if (data.to) params.to = data.to;

    router.get('/log', params, { preserveState: true });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('search', e.target.value);
  };

  const handleTypeChange = (value: string) => {
    // Map "all" to empty string for filtering
    setData('type', value === 'all' ? '' : value);
  };

  // Derived value for Select component (empty string becomes 'all')
  const selectValue = data.type === '' ? 'all' : data.type;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('from', e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('to', e.target.value);
  };

  const clearFilters = () => {
    setData({
      search: '',
      type: '',
      from: '',
      to: '',
    });
    router.get('/log', {}, { preserveState: true });
  };

  const getLogTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      default: 'bg-gray-100 text-gray-800',
      created: 'bg-green-100 text-green-800',
      updated: 'bg-blue-100 text-blue-800',
      deleted: 'bg-red-100 text-red-800',
      login: 'bg-purple-100 text-purple-800',
      logout: 'bg-indigo-100 text-indigo-800',
    };
    return colors[type.toLowerCase()] || colors.default;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <Head title="Registros de Actividad" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Registros de Actividad</h1>
            <p className="text-muted-foreground">Historial de eventos y acciones en el sistema</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Búsqueda</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar en descripción o usuario..."
                  value={data.search}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>

              <Select value={selectValue} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Tipo de evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Input
                  type="date"
                  placeholder="Desde"
                  value={data.from}
                  onChange={handleFromChange}
                  className="w-full md:w-[150px]"
                />
                <Input
                  type="date"
                  placeholder="Hasta"
                  value={data.to}
                  onChange={handleToChange}
                  className="w-full md:w-[150px]"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={submit} className="flex-1">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button onClick={clearFilters} variant="outline">
                  Limpiar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.data.length > 0 ? (
                    logs.data.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="text-sm font-medium">{formatDateTime(log.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLogTypeColor(log.log_name)} variant="outline">
                            {log.log_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-md">
                            <div className="font-medium">{log.description}</div>
                            {log.properties && Object.keys(log.properties).length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1 truncate">
                                {Object.keys(log.properties).length} propiedades
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.causer?.name || 'Sistema'}</div>
                            {log.causer?.email && (
                              <div className="text-xs text-muted-foreground">{log.causer.email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit(`/log/${log.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="text-muted-foreground">
                          No se encontraron registros de actividad.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-wrap items-center justify-center gap-1 p-4">
                {logs.links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url ?? '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 mx-1 text-sm rounded border
                      ${link.active ? 'bg-accent-foreground text-white' : 'bg-white text-gray-700'}
                      ${!link.url ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100'}`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}