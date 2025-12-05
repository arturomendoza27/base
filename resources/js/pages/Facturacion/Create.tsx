import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react'
import { Barrio, CategoriaPredio, Cliente, type BreadcrumbItem, Predio, CicloFacturacion } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { DashboardLayout } from '../dashboard/dashboard-layout';
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, SaveIcon, SearchIcon, XIcon, CalculatorIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { formatoPesos } from '@/lib/fomato_numeros';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Facturación',
        href: '/facturacion',
    },
    {
        title: 'Crear Factura',
        href: '#',
    },
];

interface CreateProps {
    clientes: Cliente[];
    predios: Predio[];
    ciclos: CicloFacturacion[];
}

export default function Create({ clientes: initialClientes, predios: initialPredios, ciclos }: CreateProps) {
    const [clientes, setClientes] = useState(initialClientes);
    const [predios, setPredios] = useState(initialPredios);
    const [prediosFiltrados, setPrediosFiltrados] = useState<Predio[]>([]);
    
    // Estado para búsqueda de cliente
    const [searchCliente, setSearchCliente] = useState('');
    const [showListCliente, setShowListCliente] = useState(false);
    
    // Estado para búsqueda de predio
    const [searchPredio, setSearchPredio] = useState('');
    const [showListPredio, setShowListPredio] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        cliente_id: "",
        predio_id: "",
        ciclo_id: "",
        fecha_emision: new Date().toISOString().split('T')[0], // Fecha actual
        fecha_vencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Hoy + 15 días
        concepto: "Consumo mensual de agua",
        saldo_anterior: 0,
        saldo_actual: 0,
        saldo_conexion: 0,
        saldo_reconexion: 0,
        total_factura: 0,
        estado: "pendiente",
        observaciones: "",
    });
    
    // Obtener mensajes flash de error
    const { flash } = usePage().props as unknown as { flash?: { error?: string } };

    // Filtrar clientes basados en búsqueda
    const filteredClientes = clientes.filter((c) =>
        c.nombre.toLowerCase().includes(searchCliente.toLowerCase())
    );

    // Filtrar predios basados en búsqueda y cliente seleccionado
    const filteredPredios = prediosFiltrados.filter((p) =>
        p.direccion_predio.toLowerCase().includes(searchPredio.toLowerCase()) ||
        p.matricula_predial.toLowerCase().includes(searchPredio.toLowerCase())
    );

    // Calcular total automáticamente
    useEffect(() => {
        const total = 
            (parseFloat(data.saldo_anterior.toString()) || 0) +
            (parseFloat(data.saldo_actual.toString()) || 0) +
            (parseFloat(data.saldo_conexion.toString()) || 0) +
            (parseFloat(data.saldo_reconexion.toString()) || 0);
        
        setData('total_factura', total);
    }, [data.saldo_anterior, data.saldo_actual, data.saldo_conexion, data.saldo_reconexion]);

    // Filtrar predios cuando se selecciona un cliente
    useEffect(() => {
        if (data.cliente_id) {
            const prediosDelCliente = predios.filter(p => p.cliente_id.toString() === data.cliente_id);
            setPrediosFiltrados(prediosDelCliente);
            
            // Si solo hay un predio, seleccionarlo automáticamente
            if (prediosDelCliente.length === 1) {
                const predioUnico = prediosDelCliente[0];
                setData('predio_id', predioUnico.id.toString());
                setSearchPredio(`${predioUnico.matricula_predial} - ${predioUnico.direccion_predio}`);
                
                // Establecer saldo anterior automáticamente si está disponible
                if (predioUnico.saldo_anterior !== undefined) {
                    setData('saldo_anterior', predioUnico.saldo_anterior);
                }
            }
        } else {
            setPrediosFiltrados([]);
        }
    }, [data.cliente_id, predios]);

    const handleSelectCliente = (cliente: Cliente) => {
        setData('cliente_id', cliente.id.toString());
        setSearchCliente(cliente.nombre);
        setShowListCliente(false);
    };

    const handleClearCliente = () => {
        setData('cliente_id', '');
        setSearchCliente('');
        setShowListCliente(false);
        setData('predio_id', '');
        setSearchPredio('');
        setPrediosFiltrados([]);
        // Resetear saldo anterior cuando se limpia el cliente
        setData('saldo_anterior', 0);
    };

    const handleSelectPredio = (predio: Predio) => {
        setData('predio_id', predio.id.toString());
        setSearchPredio(`${predio.matricula_predial} - ${predio.direccion_predio}`);
        setShowListPredio(false);
        
        // Establecer saldo anterior automáticamente si está disponible
        if (predio.saldo_anterior !== undefined) {
            setData('saldo_anterior', predio.saldo_anterior);
        }
    };

    const handleClearPredio = () => {
        setData('predio_id', '');
        setSearchPredio('');
        setShowListPredio(false);
        // Resetear saldo anterior cuando se limpia el predio
        setData('saldo_anterior', 0);
    };

    function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/facturacion');
    }

    const handleCancel = () => {
        router.visit('/facturacion');
    };

    const handleCalculateTotal = () => {
        const total = 
            (parseFloat(data.saldo_anterior.toString()) || 0) +
            (parseFloat(data.saldo_actual.toString()) || 0) +
            (parseFloat(data.saldo_conexion.toString()) || 0) +
            (parseFloat(data.saldo_reconexion.toString()) || 0);
        
        setData('total_factura', total);
    };

    return (
        <DashboardLayout>
            <Head title="Crear Factura" />
            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href="/facturacion">
                        <Button variant="ghost" size="icon">
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-balance">Nueva Factura</h1>
                        <p className="text-muted-foreground">Complete el formulario para crear una nueva factura</p>
                    </div>
                </div>
                <div className="p-6 max-w-4xl mx-auto">
                    {/* Mostrar mensajes flash de error */}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{flash.error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={submit}>
                        <div className="space-y-6">
                            {/* Información de la Factura */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de la Factura</CardTitle>
                                    <CardDescription>Complete los datos de la factura</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Cliente */}
                                        <div className="space-y-2">
                                            <Label htmlFor="cliente_id">
                                                Cliente <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="cliente_id"
                                                    type="text"
                                                    placeholder="Buscar cliente..."
                                                    value={searchCliente}
                                                    onChange={(e) => {
                                                        setSearchCliente(e.target.value);
                                                        setShowListCliente(true);
                                                    }}
                                                    onFocus={() => setShowListCliente(true)}
                                                    className="pl-10 pr-8"
                                                    autoComplete="off"
                                                />
                                                {searchCliente && (
                                                    <button
                                                        type="button"
                                                        onClick={handleClearCliente}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            {showListCliente && filteredClientes.length > 0 && (
                                                <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto w-full max-w-md">
                                                    {filteredClientes.map((cliente) => (
                                                        <li
                                                            key={cliente.id}
                                                            onClick={() => handleSelectCliente(cliente)}
                                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                        >
                                                            <div className="font-medium">{cliente.nombre}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {cliente.documento ? `Documento: ${cliente.documento}` : 'Sin documento'}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {errors.cliente_id && (
                                                <p className="text-red-500 text-sm">{errors.cliente_id}</p>
                                            )}
                                        </div>

                                        {/* Predio */}
                                        <div className="space-y-2">
                                            <Label htmlFor="predio_id">
                                                Predio <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="predio_id"
                                                    type="text"
                                                    placeholder={data.cliente_id ? "Buscar predio..." : "Seleccione un cliente primero"}
                                                    value={searchPredio}
                                                    onChange={(e) => {
                                                        setSearchPredio(e.target.value);
                                                        setShowListPredio(true);
                                                    }}
                                                    onFocus={() => data.cliente_id && setShowListPredio(true)}
                                                    className="pl-10 pr-8"
                                                    autoComplete="off"
                                                    disabled={!data.cliente_id}
                                                />
                                                {searchPredio && data.cliente_id && (
                                                    <button
                                                        type="button"
                                                        onClick={handleClearPredio}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            {showListPredio && filteredPredios.length > 0 && data.cliente_id && (
                                                <ul className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto w-full max-w-md">
                                                    {filteredPredios.map((predio) => (
                                                        <li
                                                            key={predio.id}
                                                            onClick={() => handleSelectPredio(predio)}
                                                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                        >
                                                            <div className="font-medium">{predio.direccion_predio}</div>
                                                            <div className="text-sm text-gray-500">
                                                                Matrícula: {predio.matricula_predial} | Barrio: {predio.barrio?.nombre}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {errors.predio_id && (
                                                <p className="text-red-500 text-sm">{errors.predio_id}</p>
                                            )}
                                        </div>

                                        {/* Ciclo de Facturación */}
                                        <div className="space-y-2">
                                            <Label htmlFor="ciclo_id">
                                                Ciclo de Facturación <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.ciclo_id || ''}
                                                onValueChange={(value) => setData('ciclo_id', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione un ciclo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ciclos
                                                        .filter(ciclo => ciclo.estado === 'abierto')
                                                        .map((ciclo) => (
                                                            <SelectItem key={ciclo.id} value={ciclo.id.toString()}>
                                                                {ciclo.mes} {ciclo.anio} - {ciclo.estado}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.ciclo_id && <div className="text-red-600 text-sm mt-1">{errors.ciclo_id}</div>}
                                        </div>

                                        {/* Estado */}
                                        <div className="space-y-2">
                                            <Label htmlFor="estado">
                                                Estado <span className="text-destructive">*</span>
                                            </Label>
                                            <Select
                                                value={data.estado || 'pendiente'}
                                                onValueChange={(value) => setData('estado', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                                    <SelectItem value="pagada">Pagada</SelectItem>
                                                    <SelectItem value="vencida">Vencida</SelectItem>
                                                    <SelectItem value="anulada">Anulada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.estado && <div className="text-red-600 text-sm mt-1">{errors.estado}</div>}
                                        </div>

                                        {/* Fechas */}
                                        <div className="space-y-2">
                                            <Label htmlFor="fecha_emision">
                                                Fecha de Emisión <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="fecha_emision"
                                                type="date"
                                                value={data.fecha_emision}
                                                onChange={(e) => setData('fecha_emision', e.target.value)}
                                            />
                                            {errors.fecha_emision && <div className="text-red-600 text-sm mt-1">{errors.fecha_emision}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="fecha_vencimiento">
                                                Fecha de Vencimiento <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="fecha_vencimiento"
                                                type="date"
                                                value={data.fecha_vencimiento}
                                                onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                                            />
                                            {errors.fecha_vencimiento && <div className="text-red-600 text-sm mt-1">{errors.fecha_vencimiento}</div>}
                                        </div>

                                        {/* Campos numéricos */}
                                        <div className="space-y-2">
                                            <Label htmlFor="saldo_anterior">
                                                Saldo Anterior
                                            </Label>
                                            <Input
                                                id="saldo_anterior"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={data.saldo_anterior}
                                                onChange={(e) => setData('saldo_anterior', parseFloat(e.target.value) || 0)}
                                            />
                                            {errors.saldo_anterior && <div className="text-red-600 text-sm mt-1">{errors.saldo_anterior}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="saldo_actual">
                                                Saldo Actual <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="saldo_actual"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={data.saldo_actual}
                                                onChange={(e) => setData('saldo_actual', parseFloat(e.target.value) || 0)}
                                            />
                                            {errors.saldo_actual && <div className="text-red-600 text-sm mt-1">{errors.saldo_actual}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="saldo_conexion">
                                                Saldo Conexión
                                            </Label>
                                            <Input
                                                id="saldo_conexion"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={data.saldo_conexion}
                                                onChange={(e) => setData('saldo_conexion', parseFloat(e.target.value) || 0)}
                                            />
                                            {errors.saldo_conexion && <div className="text-red-600 text-sm mt-1">{errors.saldo_conexion}</div>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="saldo_reconexion">
                                                Saldo Reconexión
                                            </Label>
                                            <Input
                                                id="saldo_reconexion"
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={data.saldo_reconexion}
                                                onChange={(e) => setData('saldo_reconexion', parseFloat(e.target.value) || 0)}
                                            />
                                            {errors.saldo_reconexion && <div className="text-red-600 text-sm mt-1">{errors.saldo_reconexion}</div>}
                                        </div>

                                        {/* Total Factura */}
                                        <div className="space-y-2">
                                            <Label htmlFor="total_factura">
                                                Total Factura <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="total_factura"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={data.total_factura}
                                                    onChange={(e) => setData('total_factura', parseFloat(e.target.value) || 0)}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleCalculateTotal}
                                                    title="Calcular total"
                                                >
                                                    <CalculatorIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Total: {formatoPesos(data.total_factura)}
                                            </div>
                                            {errors.total_factura && <div className="text-red-600 text-sm mt-1">{errors.total_factura}</div>}
                                        </div>

                                        {/* Concepto */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="concepto">
                                                Concepto <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                id="concepto"
                                                placeholder="Descripción del concepto..."
                                                value={data.concepto}
                                                onChange={(e) => setData('concepto', e.target.value)}
                                                rows={3}
                                            />
                                            {errors.concepto && <div className="text-red-600 text-sm mt-1">{errors.concepto}</div>}
                                        </div>

                                        {/* Observaciones */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="observaciones">
                                                Observaciones
                                            </Label>
                                            <Textarea
                                                id="observaciones"
                                                placeholder="Observaciones adicionales..."
                                                value={data.observaciones}
                                                onChange={(e) => setData('observaciones', e.target.value)}
                                                rows={2}
                                            />
                                            {errors.observaciones && <div className="text-red-600 text-sm mt-1">{errors.observaciones}</div>}
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
                                    {processing ? 'Guardando...' : ' Guardar Factura'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
