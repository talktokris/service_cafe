<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Webhook Routes
|--------------------------------------------------------------------------
|
| Here is where you can register webhook routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "webhook" middleware group.
|
*/

Route::post('/webhook/deploy', function (Request $request) {
    // Log the webhook request
    Log::info('Deployment webhook triggered', [
        'headers' => $request->headers->all(),
        'payload' => $request->all()
    ]);

    // Verify webhook signature (GitHub example)
    $signature = $request->header('X-Hub-Signature-256');
    $payload = $request->getContent();
    $secret = env('WEBHOOK_SECRET', 'your-webhook-secret');
    
    if ($signature) {
        $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);
        if (!hash_equals($expectedSignature, $signature)) {
            Log::error('Webhook signature verification failed');
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    // Execute deployment script
    $deployScript = base_path('deploy.sh');
    
    if (!file_exists($deployScript)) {
        Log::error('Deployment script not found: ' . $deployScript);
        return response()->json(['error' => 'Deployment script not found'], 500);
    }

    // Make script executable
    chmod($deployScript, 0755);

    // Execute deployment
    $output = [];
    $returnCode = 0;
    exec("$deployScript 2>&1", $output, $returnCode);

    Log::info('Deployment executed', [
        'return_code' => $returnCode,
        'output' => $output
    ]);

    if ($returnCode === 0) {
        return response()->json([
            'success' => true,
            'message' => 'Deployment completed successfully',
            'output' => implode("\n", $output)
        ]);
    } else {
        return response()->json([
            'success' => false,
            'message' => 'Deployment failed',
            'output' => implode("\n", $output)
        ], 500);
    }
});

Route::get('/webhook/status', function () {
    return response()->json([
        'status' => 'active',
        'timestamp' => now()->toISOString(),
        'message' => 'Webhook endpoint is active'
    ]);
});

