<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear los 3 roles
        $superAdminRole = Role::firstOrCreate(
            ['name' => 'Super Admin'],
            ['guard_name' => 'web']
        );

        $moderadorRole = Role::firstOrCreate(
            ['name' => 'Moderador'],
            ['guard_name' => 'web']
        );

        $usuarioRole = Role::firstOrCreate(
            ['name' => 'Usuario'],
            ['guard_name' => 'web']
        );

        // Obtener todos los permisos
        $allPermissions = Permission::all();

        // Super Admin: todos los permisos
        $superAdminRole->syncPermissions($allPermissions);
        $this->command->info('✓ Rol "Super Admin" creado con todos los permisos (' . $allPermissions->count() . ')');

        // Moderador: permisos de visualización y edición (no delete)
        $moderadorPermissions = Permission::whereIn('name', [
            'users.view',
            'users.create',
            'users.edit',
            'roles.view',
            'roles.edit',
        ])->get();
        $moderadorRole->syncPermissions($moderadorPermissions);
        $this->command->info('✓ Rol "Moderador" creado con ' . $moderadorPermissions->count() . ' permisos');

        // Usuario: solo permisos de visualización
        $usuarioPermissions = Permission::whereIn('name', [
            'users.view',
            'roles.view',
        ])->get();
        $usuarioRole->syncPermissions($usuarioPermissions);
        $this->command->info('✓ Rol "Usuario" creado con ' . $usuarioPermissions->count() . ' permisos');

        $this->command->newLine();
        $this->command->info('📋 Resumen de Roles y Permisos:');
        $this->command->table(
            ['Rol', 'Permisos'],
            [
                ['Super Admin', $superAdminRole->permissions->pluck('name')->implode(', ')],
                ['Moderador', $moderadorRole->permissions->pluck('name')->implode(', ')],
                ['Usuario', $usuarioRole->permissions->pluck('name')->implode(', ')],
            ]
        );
    }
}
