import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { Barrio, CategoriaPredio, Cliente, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, SaveIcon, SearchIcon, XIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import flasher from '@flasher/flasher'
import { numberToWords } from "@/lib/number-to-words"
import { Filters } from '../../types/index';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facturación',
        href: '/facturar',
    },
    {
        title: 'Facturar',
        href: '#',
    },
];



export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        observaciones: "",

    })
    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/facturacion/masiva');
    }

    const handleCancel = () => {

        router.visit('/facturas');

    }

    return (
        <DashboardLayout>
            <Head title="Facturación" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/predios">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Facturación Masiva</h1>
                        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo predio</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <Textarea
                                id="observaciones"
                                placeholder="Observaciones"
                                value={data.observaciones}
                                onChange={(e) => setData({ ...data, observaciones: e.target.value })}
                                className="pl-10 pr-8"
                            />
                            {/* <Input
                                id="observaciones"
                                type="text"
                                placeholder="0"
                                value={data.observaciones}
                                onChange={(e) => setData({ ...data, observaciones: e.target.value })}
                            /> */}



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
