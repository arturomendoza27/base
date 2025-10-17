<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Este seeder llama a todos los seeders en el orden correcto:
     * 1. PermissionSeeder - Crea todos los permisos
     * 2. RoleSeeder - Crea los 3 roles y asigna permisos
     * 3. UserSeeder - Crea usuarios de prueba con roles asignados
     */
    public function run(): void
    {
        $this->command->info('🚀 Iniciando proceso de seeding...');
        $this->command->newLine();

        // 1. Crear permisos
        $this->command->info('📝 Paso 1/3: Creando permisos...');
        $this->call(PermissionSeeder::class);
        $this->command->newLine();

        // 2. Crear roles y asignar permisos
        $this->command->info('👥 Paso 2/3: Creando roles...');
        $this->call(RoleSeeder::class);
        $this->command->newLine();

        // 3. Crear usuarios de prueba
        $this->command->info('👤 Paso 3/3: Creando usuarios...');
        $this->call(UserSeeder::class);
        $this->command->newLine();

        $this->command->info('✅ Proceso de seeding completado exitosamente!');
        $this->command->newLine();

        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📋 CREDENCIALES DE ACCESO');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->newLine();

        $this->command->table(
            ['Rol', 'Email', 'Password'],
            [
                ['Super Admin', 'superadmin@example.com', 'password'],
                ['Moderador', 'moderador@example.com', 'password'],
                ['Usuario', 'usuario@example.com', 'password'],
            ]
        );

        $this->command->newLine();
        $this->command->warn('⚠️  Recuerda cambiar estas contraseñas en producción!');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
