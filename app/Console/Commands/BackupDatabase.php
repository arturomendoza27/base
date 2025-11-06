<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class BackupDatabase extends Command
{
     protected $signature = 'backup:bd';
    protected $description = 'Backup the database';

    public function handle()
    {
        $filename = 'backup-' . date('Y-m-d_H-i-s') . '.sql';
        $path = storage_path('app/backups/' . $filename);

        // Ensure the directory exists
        if (!is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $process = new Process([
            'mysqldump',
            '--user=' . config('database.connections.mysql.username'),
            '--password=' . config('database.connections.mysql.password'),
            '--host=' . config('database.connections.mysql.host'),
            config('database.connections.mysql.database'),
            '--result-file=' . $path
        ]);

        try {
            $process->mustRun();
            $this->info('Database backup created at: ' . $path);
        } catch (ProcessFailedException $exception) {
            $this->error('Backup failed: ' . $exception->getMessage());
        }
    }
}