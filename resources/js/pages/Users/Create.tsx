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
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Create',
        href: '#',
    },
];

interface CreateProps {
    roles: string[];
}


export default function Create({ roles }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [] as string[],
    });

    function handleCheckboxChange(roleName: string, checked: boolean) {
        if (checked) {
            setData('roles', [...data.roles, roleName]);
        } else {
            setData('roles', data.roles.filter((p) => p !== roleName));
        }
    }

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/users');
    }

    const handleCancel = () => {

        router.visit('/users');

    }


    return (
        <DashboardLayout>
            <Head title="Users" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/users">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Nuevo Usuario</h1>
                        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo usuario</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Personal</CardTitle>
                                    <CardDescription>Datos básicos del usuario</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nombre Completo <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Ej: Juan Pérez García"
                                                value={data.name}
                                                onChange={(e) => setData({ ...data, name: e.target.value })}

                                            />
                                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}

                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Correo Electrónico <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="usuario@ejemplo.com"
                                                value={data.email}
                                                onChange={(e) => setData({ ...data, email: e.target.value })}

                                            />
                                            {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}

                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="12345678"
                                                value={data.password}
                                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                            />
                                            {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Confirm Password <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                value={data.password_confirmation || ''}
                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                type="password"
                                                placeholder="Confirm your password"

                                            />
                                            {errors.password_confirmation && <div className="text-red-600 text-sm mt-1">{errors.password_confirmation}</div>}

                                        </div>


                                    </div>
                                </CardContent>
                            </Card>

                            {/* Roles */}

                            <Card>
                                <CardHeader>
                                    <CardTitle>Roles</CardTitle>
                                    <CardDescription>Seleccione el rol o roles del Usuario</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {/* <Label htmlFor="address">
                                            Dirección Completa <span className="text-destructive">*</span>
                                        </Label> */}
                                        {roles.map((role) =>
                                            <label key={role} className="flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 rounded px-3 py-2 transition">
                                                <input
                                                    type="checkbox"
                                                    value={role}
                                                    onChange={e => handleCheckboxChange(role, e.target.checked)}
                                                    id={role}
                                                    className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-gray-800 font-medium">{role}</span>
                                            </label>
                                        )}
                                        {errors.roles && <div className="text-red-600 text-sm mt-1">{errors.roles}</div>}
                                    </div>

                                </CardContent>
                            </Card>


                            {/* Botones de Acción */}
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex items-center justify-center px-4 py-2 h-10 text-sm font-medium rounded-md cursor-pointer"
                                >
                                    <XIcon className="h-4 w-4 mr-2" />
                                    Cancelar
                                </Button>

                                <Button
                                    type="submit"
                                     disabled={processing}
                                    className="flex items-center justify-center px-4 py-2 h-10 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 rounded-md cursor-pointer"
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
