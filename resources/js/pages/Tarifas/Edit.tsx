import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Cliente, Tarifa, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, SaveIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { numberToWords } from "@/lib/number-to-words"
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tarifas',
        href: '/tarifas',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface EditProps {
    datos: Tarifa;
}

export default function Edit({ datos }: EditProps) {

    const { data, setData, put, processing, errors } = useForm({
        nombre: datos.nombre || '',
        valor: datos.valor || '',
        estado: datos.estado || '',
         valor_letras: "",
    });



    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/tarifas/${datos.id}`, data);
    }

    const handleCancel = () => {

        router.visit('/tarifas');

    }
useEffect(() => {
    if (data.valor) {
      const numero = parseFloat(String(data.valor || "0"))
      setData((prev) => ({
        ...prev,
        valor_letras: numberToWords(numero),
      }))
    }
  }, [data.valor])
 const handleChangeValor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value 
        const numero = parseFloat((valor || "0"))

        setData({
            ...data,
            valor,
            valor_letras: numberToWords(numero) ? numberToWords(numero) : "",
        })
    }

    return (
        <DashboardLayout>
            <Head title={`Tarifa: ${datos.nombre}`} />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/tarifas">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Editar Tarifa</h1>
                        <p className="text-muted-foreground">Complete el formulario para actualizar los datos de la tarifa</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">
                    <form
                        onSubmit={submit}>
                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Tarifaria</CardTitle>
                                    <CardDescription>Datos básicos la tarifa</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
                                                Nombre Tarifa
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
                                            <label htmlFor="valor" className="block text-gray-700 text-sm font-bold mb-2">
                                                Valor
                                            </label>
                                            <Input
                                                id="valor"
                                               value={data.valor}
                                                onChange={handleChangeValor}
                                                type="text"
                                                placeholder="0"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.valor && <div className="text-red-600 text-sm mt-1">{errors.valor}</div>}
                                        </div>
                                         <div className=' max-w-lg mx-auto'>
                                        <div className="w-full bg-blue-50 border border-blue-200 text-blue-900 rounded-md p-2 text-sm resize-none">
                                            <p className="text-xs text-blue-600 font-medium mb-1">MONTO EN LETRAS:</p>
                                            <p className="text-sm font-semibold text-blue-900">{data.valor_letras}</p>
                                        </div>
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
                                                    <SelectItem value='activa'   >Activa</SelectItem >
                                                    <SelectItem value='inactiva' >Inactiva</SelectItem >
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
