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

        // Crear usuario Moderador
        $moderador = User::firstOrCreate(
            ['email' => 'moderador@example.com'],
            [
                'name' => 'Juan Moderador',
                'password' => Hash::make('Acueducto123'),
                'email_verified_at' => now(),
            ]
        );
        $moderador->syncRoles([$moderadorRole]);
        $this->command->info('✓ Usuario Moderador creado: moderador@example.com');

        // Crear usuario normal
        $usuario = User::firstOrCreate(
            ['email' => 'usuario@example.com'],
            [
                'name' => 'María Usuario',
                'password' => Hash::make('Acueducto123'),
                'email_verified_at' => now(),
            ]
        );
        $usuario->syncRoles([$usuarioRole]);
        $this->command->info('✓ Usuario normal creado: usuario@example.com');

        // Crear usuarios adicionales de prueba
        $this->command->newLine();
        $this->command->info('Creando usuarios adicionales de prueba...');

        // 2 usuarios con rol Super Admin
        for ($i = 1; $i <= 2; $i++) {
            $user = User::firstOrCreate(
                ['email' => "admin{$i}@example.com"],
                [
                    'name' => "Admin {$i}",
                    'password' => Hash::make('Acueducto123'),
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$superAdminRole]);
        }
        $this->command->info('✓ 2 usuarios Super Admin adicionales creados');

        // 3 usuarios con rol Moderador
        for ($i = 1; $i <= 3; $i++) {
            $user = User::firstOrCreate(
                ['email' => "mod{$i}@example.com"],
                [
                    'name' => "Moderador {$i}",
                    'password' => Hash::make('Acueducto123'),
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$moderadorRole]);
        }
        $this->command->info('✓ 3 usuarios Moderador adicionales creados');

        // 5 usuarios con rol Usuario
        for ($i = 1; $i <= 5; $i++) {
            $user = User::firstOrCreate(
                ['email' => "user{$i}@example.com"],
                [
                    'name' => "Usuario {$i}",
                    'password' => Hash::make('Acueducto123'),
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles([$usuarioRole]);
        }
        $this->command->info('✓ 5 usuarios normales adicionales creados');

        $this->command->newLine();
        $this->command->info('📊 Resumen de Usuarios:');
        $this->command->table(
            ['Rol', 'Total Usuarios', 'Emails Principales'],
            [
                ['Super Admin', User::role('Super Admin')->count(), 'superadmin@example.com, admin1@example.com, admin2@example.com'],
                ['Moderador', User::role('Moderador')->count(), 'moderador@example.com, mod1@example.com, mod2@example.com, mod3@example.com'],
                ['Usuario', User::role('Usuario')->count(), 'usuario@example.com, user1@example.com, user2@example.com, ...'],
            ]
        );

        $this->command->newLine();
        $this->command->warn('🔑 Todas las contraseñas son: Acueducto123');
    }
}
