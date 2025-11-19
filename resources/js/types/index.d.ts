import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    roles?: Role[];
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
}

export interface Cliente {
    id: number;
    nombre: string;
    documento?: number | null;
    telefono?: string | null;
    email?: string | null;
    direccion?: string | null;
    estado: 'activo' | 'inactivo';
    created_at: string;
    updated_at: string;
}

export interface CategoriaPredio {
    id: number;
    nombre: string;
    descripcion?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Tarifa {
    id: number;
    nombre: string;
    valor: number;
    valor_conexion: number;
    valor_reconexion: number;
    categoria_id: number;
    vigente_desde: string;
    vigente_hasta?: string | null;
    estado: 'activa' | 'inactiva';
    created_at: string;
    updated_at: string;
    categoria: CategoriaPredio;
}

export interface Barrio {
    id: number;
    nombre: string;
    abreviatura: string;
    created_at: string;
    updated_at: string;
}

export interface Predio {
    id: number;
    cliente_id: number;
    matricula_predial: string;
    direccion_predio: string;
    barrio_id: number;
    ruta: string;
    estado_servicio: 'activo' | 'suspendido' | 'retirado';
    categoria_id: number;
    fecha_conexion: string;
    fecha_suspension: string;
    fecha_reconexion: string;
    created_at: string;
    updated_at: string;
    cliente: Cliente;
    barrio: Barrio;
    categoria: CategoriaPredio;
}

export interface Factura {
    id: number;
    cliente_id: number;
    predio_id: number;
    ciclo_id: number;
    fecha_emision: string;
    fecha_vencimiento: string;
    concepto: string;
    saldo_anterior: number;
    saldo_actual: number;
    saldo_conexion: number;
    saldo_reconexion: number;
    total_factura: number;
    estado: 'pendiente' | 'pagada' | 'vencida' | 'anulada' | 'abono';
    generada_automaticamente: boolean;
    fecha_pago?: string;
    observaciones?: string;
    cliente: Cliente;
    predio: Predio;
    ciclo: CicloFacturacion;
}

export interface CicloFacturacion {
    id: number;
    anio: number;
    mes: number;
    estado: 'abierto';
    cerrado;
    fecha_inicio: string;
    fecha_fin: string;
}

export interface CicloFacturacion {
    id: number;
    anio: number;
    mes: number;
    estado: 'abierto';
    cerrado;
    fecha_inicio: string;
    fecha_fin: string;
}

export interface MetricasCiclos {
    cartera_vencida: number;
    ciclo: string;
    numero_abonadas: number;
    numero_facturas: number;
    numero_pagadas: number;
    numero_suspendidas: number;
    numero_vencidas: number;
    saldo_restante_abonadas: number;
    total_facturado: number;
    total_recaudado: number;
    total_recaudos_anteriores: number;
    valor_abonadas: number;
    valor_pagadas: number;
    valor_suspendidas: number;
    valor_vencidas: number;
}

export interface Auth {
    user: User | null;
    permissions: string[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Filters {
    search?: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
