<?php

namespace Database\Seeders;

use App\Models\CategoriasPredios;
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
        $this->command->info('📝 Paso 1/7: Creando permisos...');
        $this->call(PermissionSeeder::class);
        $this->command->newLine();

        // 2. Crear roles y asignar permisos
        $this->command->info('👥 Paso 2/7: Creando roles...');
        $this->call(RoleSeeder::class);
        $this->command->newLine();

        // 3. Crear usuarios de prueba
        $this->command->info('👤 Paso 3/7: Creando usuarios...');
        $this->call(UserSeeder::class);
        $this->command->newLine();


        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('📋 CREDENCIALES DE ACCESO');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->newLine();

        $this->command->table(
            ['Rol', 'Email', 'Password'],
            [
                ['Super Admin', 'superadmin@example.com', 'Acueducto123'],
                ['Moderador', 'moderador@example.com', 'Acueducto123'],
                ['Usuario', 'usuario@example.com', 'Acueducto123'],
            ]
        );

        // 4. Crear barrios
        $this->command->info('📝 Paso 4/7: Creando barrios...');
        $this->call(BarriosSeeder::class);
        $this->command->newLine();

         // 5. Crear categorias
        $this->command->info('📝 Paso 5/7: Creando categorias...');
        $this->call(CategoriasPrediosSeeder::class);
        $this->command->newLine();

         // 6. Crear tarifas
        $this->command->info('📝 Paso 6/7: Creando categorias...');
        $this->call(TarifasSeeder::class);
        $this->command->newLine();

          // 7. Crear categorias
        $this->command->info('📝 Paso 7/7: Creando ciclo de facturación...');
        $this->call(CicloSeeder::class);
        $this->command->newLine();

        $this->command->info('✅ Proceso de seeding completado exitosamente!');
        $this->command->newLine();

        $this->command->newLine();
        $this->command->warn('⚠️  Fin!');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
}
