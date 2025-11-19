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
        title: 'Facturaciónn',
        href: '/facturacion',
    },
    {
        title: 'Create',
        href: '#',
    },
];

interface CreateProps {
    datos: Cliente[];
    barrios: Barrio[];
    categoria: CategoriaPredio[];
    filters: Filters[];
}

export default function Create({ datos, barrios, categoria, filters }: CreateProps) {
    const [query, setQuery] = useState("");
    const [clientes, setClientes] = useState(datos)

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: "",
        matricula_predial: "",
        direccion_predio: "",
        barrio_id: "",
        ruta: "",
        categoria_id: "",

    })

// Estado solo para mostrar texto, no se envía al backend
    const [search, setSearch] = useState('')
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
        post('/predios');
    }

    const handleCancel = () => {

        router.visit('/predios');

    }

    return (
        <DashboardLayout>
            <Head title="Predios" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/predios">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Nuevo Predio</h1>
                        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo predio</p>
                    </div>
                </div>
                <div className="p-6 max-w-lg mx-auto">

                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información Personal */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Predio</CardTitle>
                                    <CardDescription>Complete el formulario para registrar un nuevo predio</CardDescription>
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
                                                    onFocus={() => setShowList(true)}
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

                                            <datalist id="clientes">
                                                {clientes.map((cliente) => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.nombre}
                                                    </option>
                                                ))}
                                            </datalist>

                                       

                                        <div className="space-y-2">
                                            <Label htmlFor="matricula_predial">
                                                Matricula <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="matricula_predial"
                                                placeholder=""
                                                value={data.matricula_predial}
                                                onChange={(e) => setData({ ...data, matricula_predial: e.target.value })}

                                            />
                                            {errors.matricula_predial && <div className="text-red-600 text-sm mt-1">{errors.matricula_predial}</div>}

                                        </div>

                                        <div className="space-y-2">
                            
                                            <Label htmlFor="documento">
                                                Dirección <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="direccion_predio"
                                                type="text"
                                                placeholder="0"
                                                value={data.direccion_predio}
                                                onChange={(e) => setData({ ...data, direccion_predio: e.target.value })}
                                            />
                                            {errors.direccion_predio && <div className="text-red-600 text-sm mt-1">{errors.direccion_predio}</div>}

                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
                                                Barrio
                                            </label>
                                            <Select
                                                value={(data.barrio_id) || ''}
                                                onValueChange={(value) => setData('barrio_id', value)}

                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {barrios.map((barrio) => (
                                                        <SelectItem key={barrio.id} value={barrio.id.toString()}>
                                                            {barrio.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        {errors.barrio_id && <div className="text-red-600 text-sm mt-1">{errors.barrio_id}</div>}            
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="ruta">
                                                Ruta <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="ruta"
                                                type="text"
                                                placeholder="0"
                                                value={data.ruta}
                                                onChange={(e) => setData({ ...data, ruta: e.target.value })}
                                            />
                                            {errors.ruta && <div className="text-red-600 text-sm mt-1">{errors.ruta}</div>}

                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="categoria" className="block text-gray-700 text-sm font-bold mb-2">
                                                Categoria Predio
                                            </label>
                                            <Select
                                                value={(data.categoria_id) || ''}
                                                onValueChange={(value) => setData('categoria_id', value)}

                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione la categoria" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categoria.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        {errors.categoria_id && <div className="text-red-600 text-sm mt-1">{errors.barrio_id}</div>}            
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
