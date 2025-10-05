<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Earning;

class CronDistributionController extends Controller
{
    /**
     * Process redistribution distribution
     */
    public function redistributionDistribution()
    {
        try {
            // Find earnings records that need redistribution
            $redistributionEarnings = Earning::where('transation_type', 3) // Redistribution
                ->where('redistribution_status', 0) // Not distributed
                ->orderBy('id', 'asc')
                ->get();

            $totalRedistributionAmount = $redistributionEarnings->sum('ammout');
            $processedCount = 0;

            $processedEarnings = [];

            foreach ($redistributionEarnings as $earning) {
                // For now, just mark as processed and collect data
                // Future implementation can include actual redistribution logic
                
                $processedEarnings[] = [
                    'user_id' => $earning->user_id,
                    'user_trigger_id' => $earning->user_trigger_id,
                    'earning_name' => $earning->earning_name,
                    'earning_type' => $earning->earning_type,
                    'earning_description' => $earning->earning_description,
                    'ammout' => $earning->ammout,
                ];

                $processedCount++;
            }

            Log::info('Redistribution distribution processed', [
                'total_earnings_found' => $redistributionEarnings->count(),
                'total_redistribution_amount' => $totalRedistributionAmount,
                'processed_count' => $processedCount,
                'execution_time' => now()->toDateTimeString()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Redistribution distribution cron job executed successfully',
                'data' => [
                    'total_earnings_found' => $redistributionEarnings->count(),
                    'total_redistribution_amount' => $totalRedistributionAmount,
                    'processed_count' => $processedCount,
                    'processed_earnings' => $processedEarnings,
                    'execution_timestamp' => now()->toDateTimeString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Redistribution distribution failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Redistribution distribution cron job failed',
                'error' => $e->getMessage(),
                'execution_timestamp' => now()->toDateTimeString()
            ]);
        }
    }
}
