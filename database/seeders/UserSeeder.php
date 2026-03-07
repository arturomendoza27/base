<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener los roles
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $moderadorRole = Role::where('name', 'Moderador')->first();
        $usuarioRole = Role::where('name', 'Usuario')->first();

        // Crear usuario Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Administrador',
                'password' => Hash::make('Acueducto123'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->syncRoles([$superAdminRole]);
        $this->command->info('✓ Usuario Super Admin creado: superadmin@example.com');

        $this->command->newLine();
        $this->command->info('📊 Resumen de Usuarios:');
        $this->command->table(
            ['Rol', 'Total Usuarios', 'Emails Principales'],
            [
                ['Super Admin', User::role('Super Admin')->count(), 'superadmin@example.com'],
            ]
        );

        $this->command->newLine();
        $this->command->warn('🔑 Todas las contraseñas son: Acueducto123');
    }
}
