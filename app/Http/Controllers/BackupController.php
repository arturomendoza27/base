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
            
            // Definir diferentes conjuntos de opciones para intentar
            $optionsSets = [];
            
            // Conjunto 1: Con SSL deshabilitado (para errores de certificado)
            $optionsSets[] = [
                '--default-auth=mysql_native_password',
                '--ssl-mode=DISABLED',
                '--single-transaction',
                '--routines',
                '--triggers'
            ];
            
            // Conjunto 2: Sin SSL (para MariaDB que no soporta --ssl-mode)
            $optionsSets[] = [
                '--default-auth=mysql_native_password',
                '--single-transaction',
                '--routines',
                '--triggers'
            ];
            
            // Conjunto 3: Mínimo (solo lo esencial)
            $optionsSets[] = [
                '--default-auth=mysql_native_password',
                '--single-transaction'
            ];
            
            // Conjunto 4: Sin opciones específicas de Windows
            $optionsSets[] = [
                '--single-transaction',
                '--routines',
                '--triggers'
            ];
            
            // Conjunto 5: Absolutamente mínimo
            $optionsSets[] = [];
            
            $lastError = '';
            $lastOutput = [];
            $lastReturnVar = 0;
            
            // Intentar con cada conjunto de opciones
            foreach ($optionsSets as $optionSet) {
                // Construir el comando con este conjunto de opciones
                $commandParts = [$mysqldumpPath];
                
                // Agregar opciones si existen
                if (!empty($optionSet)) {
                    $commandParts = array_merge($commandParts, $optionSet);
                }
                
                // Agregar parámetros de conexión
                $commandParts[] = '--host=' . escapeshellarg($dbHost);
                $commandParts[] = '--port=' . escapeshellarg($dbPort);
                $commandParts[] = '--user=' . escapeshellarg($dbUser);
                $commandParts[] = '--password=' . escapeshellarg($dbPass);
                $commandParts[] = escapeshellarg($dbName);
                
                // Redireccionar salida al archivo
                $commandParts[] = '>' . escapeshellarg($backupPath);
                
                $command = implode(' ', $commandParts);
                
                // Ejecutar el comando
                $output = [];
                $returnVar = 0;
                
                Log::info('Intentando comando mysqldump', [
                    'command' => $command,
                    'option_set' => $optionSet,
                    'attempt' => array_search($optionSet, $optionsSets) + 1
                ]);
                
                exec($command . ' 2>&1', $output, $returnVar);
                
                // Guardar el último error para referencia
                $lastError = implode("\n", array_slice($output, 0, 3));
                $lastOutput = $output;
                $lastReturnVar = $returnVar;
                
                // Si el comando fue exitoso, salir del bucle
                if ($returnVar === 0) {
                    // Verificar que el archivo no esté vacío y contenga datos reales
                    if (file_exists($backupPath) && filesize($backupPath) > 100) {
                        $fileContent = file_get_contents($backupPath, false, null, 0, 500);
                        if (str_contains($fileContent, 'CREATE TABLE') || str_contains($fileContent, 'INSERT INTO')) {
                            Log::info('Respaldo generado exitosamente con opciones', ['option_set' => $optionSet]);
                            break;
                        } else {
                            // El archivo existe pero no contiene datos de backup
                            Log::warning('Archivo de respaldo generado pero sin datos válidos', [
                                'file_size' => filesize($backupPath),
                                'preview' => substr($fileContent, 0, 200)
                            ]);
                            // Continuar con el siguiente conjunto
                            continue;
                        }
                    }
                }
                
                // Si llegamos al final de los conjuntos y ninguno funcionó
                if ($optionSet === end($optionsSets)) {
                    Log::error('Todos los intentos de mysqldump fallaron', [
                        'last_command' => $command,
                        'last_output' => $lastOutput,
                        'last_return_var' => $lastReturnVar
                    ]);
                    
                    // Construir mensaje de error detallado
                    $errorMessage = 'Error al generar el respaldo después de varios intentos. ';
                    
                    if (!empty($lastOutput)) {
                        $errorMessage .= 'Último error: ' . implode("\n", array_slice($lastOutput, 0, 3));
                    }
                    
                    $errorMessage .= ' (Código de error: ' . $lastReturnVar . ')';
                    
                    // Agregar diagnóstico basado en el error
                    if (str_contains($lastError, 'SSL') || str_contains($lastError, 'TLS')) {
                        $errorMessage .= '\nProblema de certificado SSL. Se intentó deshabilitar SSL pero no funcionó.';
                    } elseif (str_contains($lastError, 'caching_sha2_password')) {
                        $errorMessage .= '\nProblema de autenticación. Se intentó usar mysql_native_password pero no funcionó.';
                    } elseif (str_contains($lastError, 'unknown variable')) {
                        $errorMessage .= '\nOpción no soportada por esta versión de MySQL/MariaDB.';
                    }
                    
                    $errorMessage .= '\n\nSolución para producción:';
                    $errorMessage .= '\n1. Verifique que mysql-client esté instalado: sudo apt-get install mysql-client';
                    $errorMessage .= '\n2. Pruebe conexión manual: mysql -h ' . $dbHost . ' -u ' . $dbUser . ' -p';
                    $errorMessage .= '\n3. Revise los logs para más detalles.';
                    
                    return back()->withErrors([
                        'error' => $errorMessage
                    ]);
                }
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