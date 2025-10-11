<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    protected $signature = 'email:test {email}';
    protected $description = 'Test email functionality by sending a test welcome email';

    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("🧪 Testing email functionality...");
        $this->info("📧 Sending test email to: {$email}");

        try {
            // Create a test user for the email
            $testUser = new User([
                'name' => 'Test User',
                'email' => $email,
                'member_type' => 'free'
            ]);

            // Send the welcome email
            Mail::to($email)->send(new WelcomeEmail($testUser));

            $this->info("✅ Test email sent successfully!");
            $this->info("📬 Please check your inbox and spam folder.");
            
        } catch (\Exception $e) {
            $this->error("❌ Failed to send test email:");
            $this->error($e->getMessage());
            
            $this->info("🔧 Troubleshooting tips:");
            $this->info("1. Check your .env file email settings");
            $this->info("2. Verify SMTP credentials are correct");
            $this->info("3. Check server firewall settings");
            $this->info("4. Ensure port 587/465 is open");
            
            return 1;
        }

        return 0;
    }
}
