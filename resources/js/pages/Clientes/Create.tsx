import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, SaveIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import flasher from '@flasher/flasher'
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/clientes',
    },
    {
        title: 'Create',
        href: '#',
    },
];




export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        documento: '',
        telefono: '',
        email: '',
        direccion: '',
    });



    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/clientes');
    }

    const handleCancel = () => {

        router.visit('/clientes');

    }

    return (
        <DashboardLayout>
            <Head title="Clientes" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/clientes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Nuevo Cliente</h1>
                        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo cliente</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Personal</CardTitle>
                                    <CardDescription>Datos básicos del cliente</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">
                                                Nombre Completo <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="nombre"
                                                placeholder=""
                                                value={data.nombre}
                                                onChange={(e) => setData({ ...data, nombre: e.target.value })}

                                            />
                                            {errors.nombre && <div className="text-red-600 text-sm mt-1">{errors.nombre}</div>}

                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="documento">
                                                Cédula
                                            </Label>
                                            <Input
                                                id="documento"
                                                type='number'
                                                placeholder=""
                                                value={data.documento}
                                                onChange={(e) => setData({ ...data, documento: e.target.value })}

                                            />
                                            {errors.documento && <div className="text-red-600 text-sm mt-1">{errors.documento}</div>}

                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Correo Electrónico
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder=""
                                                value={data.email}
                                                onChange={(e) => setData({ ...data, email: e.target.value })}

                                            />
                                            {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}

                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">
                                                Celular
                                            </Label>
                                            <Input
                                                id="telefono"
                                                type='tel'
                                                placeholder=""
                                                value={data.telefono}
                                                onChange={(e) => setData({ ...data, telefono: e.target.value })} />
                                            {errors.telefono && <div className="text-red-600 text-sm mt-1">{errors.telefono}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="direccion">
                                                Dirección
                                            </Label>
                                            <Input
                                                id="direccion"
                                                type='text'
                                                placeholder=""
                                                value={data.direccion}
                                                onChange={(e) => setData({ ...data, direccion: e.target.value })}

                                            />
                                            {errors.direccion && <div className="text-red-600 text-sm mt-1">{errors.direccion}</div>}

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
                                    {processing ? 'Guardando...' : ' Guardar'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
