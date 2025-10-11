<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class FixSessionIssues extends Command
{
    protected $signature = 'session:fix';
    protected $description = 'Fix session and CSRF token issues';

    public function handle()
    {
        $this->info('🔧 Fixing session and CSRF token issues...');

        // 1. Clear all caches
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');

        // 2. Regenerate application key
        $this->call('key:generate', ['--force' => true]);

        // 3. Clear sessions table if using database sessions
        try {
            DB::table('sessions')->truncate();
            $this->info('✅ Sessions table cleared');
        } catch (\Exception $e) {
            $this->warn('⚠️ Could not clear sessions table: ' . $e->getMessage());
        }

        // 4. Clear session files if using file sessions
        $sessionPath = storage_path('framework/sessions');
        if (File::exists($sessionPath)) {
            File::cleanDirectory($sessionPath);
            $this->info('✅ Session files cleared');
        }

        // 5. Rebuild caches
        $this->call('config:cache');
        $this->call('route:cache');
        $this->call('view:cache');

        $this->info('✅ Session issues fixed successfully!');
        $this->info('🔄 Please clear your browser cookies and try again.');
    }
}
