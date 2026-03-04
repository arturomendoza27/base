<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BackupDatabase extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Backup the database';

    public function handle()
{
    $connection = config('database.default');
    $dbConfig   = config("database.connections.{$connection}");

    $database = $dbConfig['database'];
    $username = $dbConfig['username'];
    $password = $dbConfig['password'];
    $host     = $dbConfig['host'];
    $port     = $dbConfig['port'] ?? 3306;

    $backupPath = storage_path('app/backups');

    if (!file_exists($backupPath)) {
        mkdir($backupPath, 0755, true);
    }

    $filename = $backupPath . '/' . $database . '_' . now()->format('Y_m_d_His') . '.sql';

    // Detectar sistema operativo
    $mysqldump = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN'
        ? '"C:\\xampp\\mysql\\bin\\mysqldump.exe"' // Ajustar si es necesario
        : 'mysqldump';

    // Crear archivo temporal para credenciales (más seguro)
    $tempFile = tempnam(sys_get_temp_dir(), 'db_backup_');

    file_put_contents($tempFile, 
        "[client]
user={$username}
password=\"{$password}\"
host={$host}
port={$port}"
    );

    $command = "{$mysqldump} --defaults-extra-file=\"{$tempFile}\" {$database} > \"{$filename}\" 2>&1";

    exec($command, $output, $result);

    unlink($tempFile);

    if ($result !== 0) {
        $this->error('Error al generar respaldo:');
        $this->error(implode("\n", $output));
        return Command::FAILURE;
    }

    $this->info("Respaldo generado correctamente:");
    $this->info($filename);

    return Command::SUCCESS;
}
}