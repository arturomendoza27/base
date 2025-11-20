<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            "users.view",
            "users.create",
            "users.edit",
            "users.delete",
            "roles.view",
            "roles.create",
            "roles.edit",
            "roles.delete",
            "clientes.view",
            "clientes.show",
            "clientes.create",
            "clientes.edit",
            "clientes.delete",
            "clientes.import",
            "clientes.export",
            "tarifas.view",
            "tarifas.show",
            "tarifas.create",
            "tarifas.edit",
            "tarifas.delete",
            "predios.view",
            "predios.show",
            "predios.create",
            "predios.edit",
            "predios.delete",
            "predios.import",
            "predios.export",
            "cicloFacturacion.view",
            "cicloFacturacion.show",
            "cicloFacturacion.create",
            "cicloFacturacion.edit",
            "cicloFacturacion.delete",
            "facturacion.view",
            "facturacion.show",
            "facturacion.create",
            "facturacion.edit",
            "facturacion.delete",
            "facturacion.import",
            "facturacion.export",
            "caja.view",
            "caja.show",
            "caja.create",
            "caja.edit",
            "caja.delete",
            "pagos.view",
            "pagos.show",
            "pagos.create",
            "pagos.edit",
            "pagos.delete",
            "pagos.import",
            "pagos.export",
            "reportes.view",
            "reportes.show",
            "reportes.create",
            "reportes.edit",
            "reportes.delete",
            "reportes.import",
            "reportes.export",
            "log.view",
            'settings.view'
             

        ];

        foreach ($permissions as $value) {
            Permission::create(['name' => $value]);
        }
    }
}
