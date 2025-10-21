import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Cliente, Filters, Predio, Tarifa, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, SaveIcon, SearchIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { numberToWords } from "@/lib/number-to-words"
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Predios',
        href: '/predios',
    },
    {
        title: 'Edit',
        href: '#',
    },
];


interface EditProps {
    datos: Predio;
    clientes: Cliente[];
    filters: Filters[];
}

export default function Edit({ datos, clientes }: EditProps) {

    const { data, setData, put, processing, errors } = useForm({
        cliente_id: datos.cliente_id || '',
        direccion: datos.direccion_predio || '',
        matricula: datos.matricula_predial || '',
        ruta: datos.ruta || '',
        estado: datos.estado_servicio || '',
    })

    // Estado solo para mostrar texto, no se envía al backend
    const [search, setSearch] = useState(datos.cliente?.nombre || '')
    const [showList, setShowList] = useState(false)

    const handleSelectCliente = (cliente) => {
        setData({
            ...data,
            cliente_id: cliente.id, // ✅ solo se guarda el ID
        })
        setSearch(cliente.nombre) // ✅ se muestra el nombre en el input
        setShowList(false)
    }

    const handleClearCliente = () => {
        setData({
            ...data,
            cliente_id: '',
        })
        setSearch('')
        setShowList(false)
    }

    const filteredClientes = clientes.filter((c) =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
    )


    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/predios/${datos.id}`, data);
    }

    const handleCancel = () => {

        router.visit('/predios');

    }



    return (
        <DashboardLayout>
            <Head title={`Tarifa: ${datos.direccion_predio}`} />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/tarifas">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Editar Predio</h1>
                        <p className="text-muted-foreground">Complete el formulario para actualizar los datos del predio</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">
                    <form
                        onSubmit={submit}>
                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Predio</CardTitle>
                                    <CardDescription>Datos básicos del predio</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="cliente_id" className="block text-gray-700 text-sm font-bold mb-2">
                                                Cliente
                                            </label>
                                            <div className="relative flex-1 max-w-sm">
                                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                                <Input
                                                    id="cliente_id"
                                                    type="text"
                                                    placeholder="Buscar clientes..."
                                                    value={search}
                                                    onChange={(e) => {
                                                        setSearch(e.target.value)
                                                        setShowList(true)
                                                    }}
                                                    className="pl-10 pr-8"
                                                    autoComplete="off"
                                                />

                                                {search && (
                                                    <button
                                                        type="button"
                                                        onClick={handleClearCliente}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            {showList && filteredClientes.length > 0 && (
                                                <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto w-full max-w-sm">
                                                    {filteredClientes.map((cliente) => (
                                                        <li
                                                            key={cliente.id}
                                                            onClick={() => handleSelectCliente(cliente)}
                                                            className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                                                        >
                                                            {cliente.nombre}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {errors.cliente_id && (
                                                <p className="text-red-500 text-sm">{errors.cliente_id}</p>
                                            )}
                                        </div>


                                        <div className="space-y-2">
                                            <label htmlFor="matricula" className="block text-gray-700 text-sm font-bold mb-2">
                                                Matricula
                                            </label>
                                            <Input
                                                id="matricula"
                                                value={data.matricula}
                                                onChange={e => setData('matricula', e.target.value)}
                                                type="text"
                                                placeholder="0"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.matricula && <div className="text-red-600 text-sm mt-1">{errors.matricula}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">
                                                Dirección
                                            </label>
                                            <Input
                                                id="direccion"
                                                value={data.direccion}
                                                onChange={e => setData('direccion', e.target.value)}
                                                type="text"
                                                placeholder="0"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.direccion && <div className="text-red-600 text-sm mt-1">{errors.direccion}</div>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="valorruta" className="block text-gray-700 text-sm font-bold mb-2">
                                                Ruta
                                            </label>
                                            <Input
                                                id="ruta"
                                                value={data.ruta}
                                                onChange={e => setData('ruta', e.target.value)}
                                                type="text"
                                                placeholder="0"
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                            {errors.ruta && <div className="text-red-600 text-sm mt-1">{errors.ruta}</div>}
                                        </div>


                                        <div>
                                            <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
                                                Estado
                                            </label>
                                            <Select
                                                value={(data.estado as "activo" | "suspendido" | "retirado") || ''}
                                                onValueChange={(value: "activo" | "suspendido" | "retirado") => setData('estado', value)}

                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='activo'   >Activo</SelectItem >
                                                    <SelectItem value='suspendido' >Suspendido</SelectItem >
                                                    <SelectItem value='retirado' > Retirado</SelectItem>
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
