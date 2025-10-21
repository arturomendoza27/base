import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Cliente, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, SaveIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clientes',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface EditProps {
    cliente: Cliente;
}

export default function Edit({ cliente }: EditProps) {

    const { data, setData, put, processing, errors } = useForm({
        nombre: cliente.nombre || '',
        email: cliente.email || '',
        documento: cliente.documento || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        estado: cliente.estado || '',
    });



    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/clientes/${cliente.id}`, data);
    }

    const handleCancel = () => {

        router.visit('/clientes');

    }



    return (
        <DashboardLayout>
            <Head title={`Cliente: ${cliente.nombre}`} />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/clientes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Editar Cliente</h1>
                        <p className="text-muted-foreground">Complete el formulario para actualizar los datos del cliente</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">
                    <form
                        onSubmit={submit}>
                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Personal</CardTitle>
                                    <CardDescription>Datos básicos del cliente</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
                                                Nombre Completo
                                            </label>
                                            <Input
                                                id="nombre"
                                                value={data.nombre}
                                                onChange={e => setData('nombre', e.target.value)}
                                                type="text"
                                                placeholder="Ingrese el nombre"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="documento" className="block text-gray-700 text-sm font-bold mb-2">
                                                Cédula
                                            </label>
                                            <Input
                                                id="documento"
                                                value={data.documento}
                                                onChange={e => setData('documento', e.target.value)}
                                                type="text"
                                                placeholder="Ingrese el numero de cédula"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.documento && <div className="text-red-600 text-sm mt-1">{errors.documento}</div>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                                Email
                                            </label>
                                            <Input
                                                id="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                type="email"
                                                placeholder="Enter your email"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                                        </div>
                                        {/* Password */}
                                        <div>
                                            <label htmlFor="telefono" className="block text-gray-700 text-sm font-bold mb-2">
                                                Celular
                                            </label>
                                            <Input
                                                id="telefono"
                                                value={data.telefono}
                                                onChange={e => setData('telefono', e.target.value)}
                                                type="tel"
                                                placeholder="Ingrese un numero de contacto"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.telefono && <div className="text-red-600 text-sm mt-1">{errors.telefono}</div>}
                                        </div>
                                        {/* Confirm Password */}
                                        <div>
                                            <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">
                                                Dirección
                                            </label>
                                            <Input
                                                id="direccion"
                                                value={data.direccion || ''}
                                                onChange={e => setData('direccion', e.target.value)}
                                                type="text"
                                                placeholder="Ingrese la dirección el cliente"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.direccion && <div className="text-red-600 text-sm mt-1">{errors.direccion}</div>}
                                        </div>

                                        <div>
                                            <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
                                                Estado
                                            </label>
                                            <Select
                                                value={(data.estado as "activo" | "inactivo") || ''}
                                                onValueChange={(value: "activo" | "inactivo") => setData('estado', value)}

                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='activo'   >Activo</SelectItem >
                                                    <SelectItem value='inactivo' >Incativo</SelectItem >
                                                </SelectContent>
                                            </Select>

                                        </div>
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
                                    {processing ? 'Actualizando...' : ' Actualizar'}

                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        </DashboardLayout >
    );
}
