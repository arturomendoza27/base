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
import { numberToWords } from "@/lib/number-to-words"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tarifas',
        href: '/tarifas',
    },
    {
        title: 'Create',
        href: '#',
    },
];


export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        valor: "",
        valor_letras: "",
    })



    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/tarifas');
    }

    const handleCancel = () => {

        router.visit('/tarifas');

    }

    const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value
        const numero = parseFloat(valor || "0")

        setData({
            ...data,
            valor,
            valor_letras: valor ? numberToWords(numero) : "",
        })
    }


    return (
        <DashboardLayout>
            <Head title="Tarifas" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/tarifas">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Nueva Tarifa</h1>
                        <p className="text-muted-foreground">Complete el formulario para registrar una nueva tarifa</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Tarifa</CardTitle>
                                    <CardDescription>Deifinir el nombre y valor de la tarifa</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nombre">
                                                Nombre Tarifa <span className="text-destructive">*</span>
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
                                                Valor <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="valor"
                                                type="number"
                                                placeholder="0"
                                                value={data.valor}
                                                onChange={handleChangeValor}
                                            />
                                            {errors.valor && <div className="text-red-600 text-sm mt-1">{errors.valor}</div>}

                                        </div>


                                    </div>
                                    <div className=' max-w-lg mx-auto'>
                                        <div className="w-full bg-blue-50 border border-blue-200 text-blue-900 rounded-md p-2 text-sm resize-none">
                                            <p className="text-xs text-blue-600 font-medium mb-1">MONTO EN LETRAS:</p>
                                            <p className="text-sm font-semibold text-blue-900">{data.valor_letras}</p>
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
