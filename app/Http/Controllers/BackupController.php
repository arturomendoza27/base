<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\Log;

class BackupController extends Controller
{
    /**
     * Muestra la página de administración de respaldos
     */
    public function index()
    {
        return inertia('Backups/Index', [
            'backupExists' => $this->backupExists(),
            'backupSize' => $this->getBackupSize(),
            'lastModified' => $this->getLastModified(),
        ]);
    }

    /**
     * Genera un nuevo respaldo de la base de datos
     */
    public function generate(Request $request)
    {
        try {
            // Validar que mysqldump esté disponible
            if (!$this->isMysqldumpAvailable()) {
                $errorMessage = 'El comando mysqldump no está disponible en el servidor.';
                
                // Agregar instrucciones específicas según el sistema operativo
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    $errorMessage .= ' En Windows, instale XAMPP o MySQL y agregue la ruta de mysqldump al PATH, o configure MYSQLDUMP_PATH en el archivo .env.';
                } else {
                    $errorMessage .= ' En Linux/Ubuntu, instálelo con: sudo apt-get update && sudo apt-get install mysql-client';
                }
                
                return back()->withErrors([
                    'error' => $errorMessage
                ]);
            }

            // Validar permisos de escritura
            $backupPath = storage_path('app/backups/backup.sql');
            $backupDir = dirname($backupPath);
            
            if (!is_writable($backupDir)) {
                return back()->withErrors([
                    'error' => 'No hay permisos de escritura en el directorio de respaldos.'
                ]);
            }

            // Eliminar el respaldo anterior si existe
            if (file_exists($backupPath)) {
                if (!unlink($backupPath)) {
                    return back()->withErrors([
                        'error' => 'No se pudo eliminar el respaldo anterior.'
                    ]);
                }
            }

            // Obtener credenciales de la base de datos
            $dbHost = config('database.connections.mysql.host');
            $dbPort = config('database.connections.mysql.port');
            $dbName = config('database.connections.mysql.database');
            $dbUser = config('database.connections.mysql.username');
            $dbPass = config('database.connections.mysql.password');
            
            // Limpiar la contraseña (eliminar espacios en blanco al inicio/final)
            $dbPass = trim($dbPass);

            // Construir el comando mysqldump con ruta obtenida dinámicamente
            $mysqldumpPath = $this->getMysqldumpPath();
            
            // Opciones adicionales para resolver problemas comunes
            $additionalOptions = [];
            
            // Para problemas de autenticación caching_sha2_password en MySQL 8+ (especialmente en Windows/XAMPP)
            // Nota: MariaDB (XAMPP) no soporta --ssl-mode=DISABLED, así que lo omitimos
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                // Solo agregar --default-auth=mysql_native_password para problemas de autenticación
                $additionalOptions[] = '--default-auth=mysql_native_password';
            }
            
            // Para todos los sistemas, agregar opciones útiles (pero compatibles)
            $additionalOptions[] = '--single-transaction';
            $additionalOptions[] = '--routines';
            $additionalOptions[] = '--triggers';
            // Nota: --events puede causar problemas en algunas versiones, lo omitimos por ahora
            
            // Construir el comando de forma más robusta
            $commandParts = [$mysqldumpPath];
            
            // Agregar opciones si existen
            if (!empty($additionalOptions)) {
                $commandParts = array_merge($commandParts, $additionalOptions);
            }
            
            // Agregar parámetros de conexión
            $commandParts[] = '--host=' . escapeshellarg($dbHost);
            $commandParts[] = '--port=' . escapeshellarg($dbPort);
            $commandParts[] = '--user=' . escapeshellarg($dbUser);
            $commandParts[] = '--password=' . escapeshellarg($dbPass);
            $commandParts[] = escapeshellarg($dbName);
            
            // Redireccionar salida al archivo (sin comillas extra alrededor del path)
            $commandParts[] = '>' . escapeshellarg($backupPath);
            
            $command = implode(' ', $commandParts);

            // Ejecutar el comando con logging detallado
            $output = [];
            $returnVar = 0;
            
            Log::info('Ejecutando comando mysqldump', [
                'command' => $command,
                'mysqldump_path' => $mysqldumpPath,
                'db_host' => $dbHost,
                'db_port' => $dbPort,
                'db_name' => $dbName
            ]);
            
            exec($command . ' 2>&1', $output, $returnVar);

            if ($returnVar !== 0) {
                Log::error('Error al generar respaldo', [
                    'command' => $command,
                    'output' => $output,
                    'return_var' => $returnVar,
                    'mysqldump_path' => $mysqldumpPath,
                    'db_host' => $dbHost,
                    'db_port' => $dbPort,
                    'db_name' => $dbName,
                    'db_user' => $dbUser
                ]);
                
                // Construir mensaje de error más informativo
                $errorMessage = 'Error al generar el respaldo. ';
                
                if (!empty($output)) {
                    $errorMessage .= 'Detalles: ' . implode("\n", array_slice($output, 0, 5)); // Mostrar solo primeros 5 líneas
                } else {
                    $errorMessage .= 'No se obtuvo salida del comando. ';
                }
                
                $errorMessage .= ' (Código de error: ' . $returnVar . ')';
                
                // Agregar sugerencias según el código de error
                if ($returnVar === 1) {
                    $errorMessage .= ' Posible problema de permisos o credenciales de la base de datos.';
                } elseif ($returnVar === 2) {
                    $errorMessage .= ' Error de sintaxis en el comando mysqldump.';
                } elseif ($returnVar === 127) {
                    $errorMessage .= ' Comando mysqldump no encontrado. Verifique la instalación.';
                }
                
                return back()->withErrors([
                    'error' => $errorMessage
                ]);
            }

            // Verificar que el archivo se creó correctamente
            if (!file_exists($backupPath) || filesize($backupPath) === 0) {
                return back()->withErrors([
                    'error' => 'El respaldo se generó pero el archivo está vacío o no se creó.'
                ]);
            }

            return back()->with('success', 'Respaldo generado exitosamente.');

        } catch (\Exception $e) {
            Log::error('Excepción al generar respaldo: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Error inesperado: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Descarga el respaldo actual
     */
    public function download(): BinaryFileResponse
    {
        $backupPath = storage_path('app/backups/backup.sql');

        if (!file_exists($backupPath)) {
            abort(404, 'No existe un respaldo para descargar.');
        }

        return response()->download($backupPath, 'backup_' . date('Y-m-d_H-i-s') . '.sql', [
            'Content-Type' => 'application/sql',
        ]);
    }

    /**
     * Verifica si mysqldump está disponible en el sistema
     */
    private function isMysqldumpAvailable(): bool
    {
        $mysqldumpPath = $this->getMysqldumpPath();
        $output = [];
        $returnVar = 0;
        exec($mysqldumpPath . ' --version 2>&1', $output, $returnVar);
        
        return $returnVar === 0;
    }

    /**
     * Obtiene la ruta de mysqldump configurada o busca en el PATH
     */
    private function getMysqldumpPath(): string
    {
        // 1. Primero intentar con la variable de entorno MYSQLDUMP_PATH
        $customPath = env('MYSQLDUMP_PATH');
        if ($customPath && $this->isExecutable($customPath)) {
            return $this->quotePath($customPath);
        }

        // 2. Para Windows: intentar con la ruta de XAMPP por defecto
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $windowsPaths = [
                'C:\xampp\mysql\bin\mysqldump.exe',
                'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe',
                'C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqldump.exe',
                'C:\Program Files\MariaDB 10.11\bin\mysqldump.exe',
                'C:\Program Files\MariaDB 10.10\bin\mysqldump.exe',
                'mysqldump.exe'
            ];

            foreach ($windowsPaths as $path) {
                if ($this->isExecutable($path)) {
                    return $this->quotePath($path);
                }
            }
        } else {
            // 3. Para Linux/Unix: buscar en rutas comunes y PATH
            $unixPaths = [
                '/usr/bin/mysqldump',
                '/usr/local/bin/mysqldump',
                '/opt/homebrew/bin/mysqldump',
                '/usr/local/mysql/bin/mysqldump',
                'mysqldump'
            ];

            foreach ($unixPaths as $path) {
                if ($this->isExecutable($path)) {
                    return $path;
                }
            }
        }

        // 4. Si no se encuentra, devolver 'mysqldump' para que el error sea claro
        return 'mysqldump';
    }

    /**
     * Verifica si un archivo es ejecutable
     */
    private function isExecutable(string $path): bool
    {
        // Para rutas absolutas, verificar si el archivo existe y es ejecutable
        if (str_contains($path, DIRECTORY_SEPARATOR) || (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' && str_contains($path, ':'))) {
            return file_exists($path) && is_executable($path);
        }
        
        // Para comandos en PATH, usar 'which' o 'where'
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $output = [];
            $returnVar = 0;
            exec('where ' . escapeshellarg($path) . ' 2>&1', $output, $returnVar);
            return $returnVar === 0 && !empty($output);
        } else {
            $output = [];
            $returnVar = 0;
            exec('which ' . escapeshellarg($path) . ' 2>&1', $output, $returnVar);
            return $returnVar === 0 && !empty($output);
        }
    }

    /**
     * Agrega comillas a la ruta si es necesario (para Windows)
     */
    private function quotePath(string $path): string
    {
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' && str_contains($path, ' ')) {
            return '"' . $path . '"';
        }
        return $path;
    }

    /**
     * Verifica si existe un respaldo
     */
    private function backupExists(): bool
    {
        return file_exists(storage_path('app/backups/backup.sql'));
    }

    /**
     * Obtiene el tamaño del respaldo en formato legible
     */
    private function getBackupSize(): string
    {
        $backupPath = storage_path('app/backups/backup.sql');
        
        if (!file_exists($backupPath)) {
            return '0 B';
        }

        $size = filesize($backupPath);
        
        if ($size >= 1073741824) {
            return number_format($size / 1073741824, 2) . ' GB';
        } elseif ($size >= 1048576) {
            return number_format($size / 1048576, 2) . ' MB';
        } elseif ($size >= 1024) {
            return number_format($size / 1024, 2) . ' KB';
        } else {
            return $size . ' B';
        }
    }

    /**
     * Obtiene la fecha de última modificación del respaldo
     */
    private function getLastModified(): ?string
    {
        $backupPath = storage_path('app/backups/backup.sql');
        
        if (!file_exists($backupPath)) {
            return null;
        }

        return date('Y-m-d H:i:s', filemtime($backupPath));
    }
}