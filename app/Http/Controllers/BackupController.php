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
        return inertia('backups/index', [
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
                return back()->withErrors([
                    'error' => 'El comando mysqldump no está disponible en el servidor.'
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

            // Construir el comando mysqldump con ruta completa
            $command = sprintf(
                '"C:\xampp\mysql\bin\mysqldump.exe" --host=%s --port=%s --user=%s --password=%s %s > "%s"',
                escapeshellarg($dbHost),
                escapeshellarg($dbPort),
                escapeshellarg($dbUser),
                escapeshellarg($dbPass),
                escapeshellarg($dbName),
                escapeshellarg($backupPath)
            );

            // Ejecutar el comando
            $output = [];
            $returnVar = 0;
            exec($command . ' 2>&1', $output, $returnVar);

            if ($returnVar !== 0) {
                Log::error('Error al generar respaldo', [
                    'command' => $command,
                    'output' => $output,
                    'return_var' => $returnVar
                ]);
                
                return back()->withErrors([
                    'error' => 'Error al generar el respaldo: ' . implode("\n", $output)
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
        $output = [];
        $returnVar = 0;
        exec('"C:\xampp\mysql\bin\mysqldump.exe" --version 2>&1', $output, $returnVar);
        
        return $returnVar === 0;
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