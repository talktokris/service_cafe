<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Earning;
use App\Models\User;

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
                // Store current user_id as current_loop_id
                $current_loop_id = $earning->user_id;
                
                // Find 15 levels of upline
                $upline_levels = $this->findUplineLevels($current_loop_id, 15);
                
                $processedEarnings[] = [
                    'user_id' => $earning->user_id,
                    'user_trigger_id' => $earning->user_trigger_id,
                    'earning_name' => $earning->earning_name,
                    'earning_type' => $earning->earning_type,
                    'earning_description' => $earning->earning_description,
                    'ammout' => $earning->ammout,
                    'current_loop_id' => $current_loop_id,
                    'upline_levels' => $upline_levels,
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

    /**
     * Find upline levels for redistribution
     */
    private function findUplineLevels($current_loop_id, $maxLevels = 15)
    {
        $upline_levels = [];
        $current_upline_id = $current_loop_id;
        
        Log::info('Starting upline search for redistribution', [
            'current_loop_id' => $current_loop_id,
            'max_levels' => $maxLevels
        ]);

        for ($level = 1; $level <= $maxLevels; $level++) {
            // Find the referred_by value from users table where id = current_upline_id
            $current_user = User::find($current_upline_id);
            
            if (!$current_user) {
                Log::info("User not found for ID: {$current_upline_id} at level {$level}");
                break;
            }

            if (!$current_user->referred_by) {
                Log::info("No referred_by found for user ID: {$current_upline_id} at level {$level}");
                break;
            }

            $current_upline_id = $current_user->referred_by;

            // Find member_type from users table where member_type = paid and id = current_upline_id
            $upline_user = User::find($current_upline_id);
            
            if (!$upline_user) {
                Log::info("Upline user not found for ID: {$current_upline_id} at level {$level}");
                break;
            }

            Log::info("Level {$level} search", [
                'current_upline_id' => $current_upline_id,
                'member_type' => $upline_user->member_type,
                'searched_from' => $current_user->id
            ]);

            if ($upline_user->member_type === 'paid') {
                // Found a paid member at this level
                $upline_levels[] = [
                    'level' => $level,
                    'upline_id' => $current_upline_id,
                    'searched_from' => $current_user->id
                ];
                
                Log::info("Found paid member at level {$level}", [
                    'level' => $level,
                    'upline_id' => $current_upline_id,
                    'member_type' => $upline_user->member_type
                ]);
            } else {
                // Member is free, continue searching for next paid member
                Log::info("Found free member at level {$level}, continuing search", [
                    'level' => $level,
                    'upline_id' => $current_upline_id,
                    'member_type' => $upline_user->member_type
                ]);
                
                // Continue to next iteration to find the next paid member
                continue;
            }
        }

        Log::info('Upline search completed for redistribution', [
            'current_loop_id' => $current_loop_id,
            'levels_found' => count($upline_levels),
            'upline_levels' => $upline_levels
        ]);

        return $upline_levels;
    }
}
