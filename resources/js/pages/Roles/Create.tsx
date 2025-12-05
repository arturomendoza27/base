import { Input } from '@/components/ui/input';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, SaveIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Crear Rol',
        href: '#',
    },
];

interface CreateProps {
    permissions: string[];
}

export default function Create({ permissions }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    function handleCheckboxChange(permissionName: string, checked: boolean) {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter((p) => p !== permissionName));
        }
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/roles');
    }

    const handleCancel = () => {
        router.visit('/roles');
    };

    return (
        <DashboardLayout>
            <Head title="Crear Rol" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/roles">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Nuevo Rol</h1>
                        <p className="text-muted-foreground">Complete el formulario para crear un nuevo rol</p>
                    </div>
                </div>
                <div className="p-6 max-w-4xl mx-auto">
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información del Rol */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información del Rol</CardTitle>
                                    <CardDescription>Complete los datos del rol</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Nombre del Rol */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nombre del Rol <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            type="text"
                                            placeholder="Ingrese el nombre del rol"
                                        />
                                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    {/* Permisos */}
                                    <div className="space-y-4">
                                        <Label>
                                            Permisos <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {permissions.map((permission) => (
                                                <div key={permission} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={permission}
                                                        checked={data.permissions.includes(permission)}
                                                        onCheckedChange={(checked) => 
                                                            handleCheckboxChange(permission, checked === true)
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={permission}
                                                        className="text-sm font-normal cursor-pointer"
                                                    >
                                                        {permission}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.permissions && <div className="text-red-600 text-sm mt-1">{errors.permissions}</div>}
                                        <p className="text-sm text-muted-foreground">
                                            Seleccionados: {data.permissions.length} de {permissions.length} permisos
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex items-center justify-center px-4 py-2 h-10 text-sm font-medium rounded-md"
                                >
                                    <XIcon className="h-4 w-4 mr-2" />
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center justify-center px-4 py-2 h-10 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded-md"
                                >
                                    <SaveIcon className="w-4 h-4 mr-2" />
                                    {processing ? 'Guardando...' : ' Guardar Rol'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
