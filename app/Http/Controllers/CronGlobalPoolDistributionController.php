<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class CronGlobalPoolDistributionController extends Controller
{
    /**
     * Handle global pool distribution cron job
     * Gets the sum of amounts from global_pools table for current month and distributes to badge users
     */
    public function handle(Request $request)
    {
        try {
            // Get start and end of current month
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();

            Log::info('Global Pool Distribution Cron Started', [
                'start_date' => $startOfMonth->toDateTimeString(),
                'end_date' => $endOfMonth->toDateTimeString()
            ]);

            // Get sum of amount from global_pools where countStatus=0 and status=0
            $query = DB::table('global_pools')
                ->where('countStatus', 0)
                ->where('status', 0)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth]);

            // Get the total sum
            $totalAmount = $query->sum('ammout');

            // If total amount is zero, no need to process further
            if ($totalAmount <= 0) {
                Log::info('Global Pool Distribution Cron - No amount to distribute', [
                    'total_amount' => $totalAmount,
                    'start_date' => $startOfMonth->toDateTimeString(),
                    'end_date' => $endOfMonth->toDateTimeString()
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'No global pool amount to distribute for current month',
                    'data' => [
                        'total_amount' => $totalAmount,
                        'record_count' => 0,
                        'distribution_amounts' => [
                            'seven_star_amount' => 0,
                            'mega_star_amount' => 0,
                            'giga_star_amount' => 0,
                        ],
                        'distribution_results' => [
                            'seven_star' => ['earnings_created' => 0, 'message' => 'No distribution needed - total amount is zero'],
                            'mega_star' => ['earnings_created' => 0, 'message' => 'No distribution needed - total amount is zero'],
                            'giga_star' => ['earnings_created' => 0, 'message' => 'No distribution needed - total amount is zero'],
                        ],
                        'global_pools_updated' => [
                            'updated_count' => 0,
                            'message' => 'No global pools records to update - total amount is zero'
                        ],
                        'date_range' => [
                            'from_date' => $startOfMonth->toDateTimeString(),
                            'to_date' => $endOfMonth->toDateTimeString(),
                        ]
                    ],
                    'timestamp' => now()->toDateTimeString()
                ]);
            }

            // Get additional data for reference
            $recordCount = $query->count();
            
            // Get min and max IDs for reference
            $idRange = DB::table('global_pools')
                ->where('countStatus', 0)
                ->where('status', 0)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->selectRaw('MIN(id) as min_id, MAX(id) as max_id')
                ->first();

            // Calculate distribution amounts
            $sevenStarAmount = $totalAmount * 0.50; // 50%
            $megaStarAmount = $totalAmount * 0.30;  // 30%
            $gigaStarAmount = $totalAmount * 0.20;  // 20%

            Log::info('Global Pool Distribution Amounts Calculated', [
                'total_amount' => $totalAmount,
                'seven_star_amount' => $sevenStarAmount,
                'mega_star_amount' => $megaStarAmount,
                'giga_star_amount' => $gigaStarAmount
            ]);

            // Start database transaction
            DB::beginTransaction();

            $distributionResults = [];

            // Process Seven Star Distribution
            $sevenStarResult = $this->processBadgeDistribution('seven', $sevenStarAmount, 'badge_seven_stars');
            $distributionResults['seven_star'] = $sevenStarResult;

            // Process Mega Star Distribution
            $megaStarResult = $this->processBadgeDistribution('mega', $megaStarAmount, 'badge_mega_stars');
            $distributionResults['mega_star'] = $megaStarResult;

            // Process Giga Star Distribution
            $gigaStarResult = $this->processBadgeDistribution('giga', $gigaStarAmount, 'badge_giga_stars');
            $distributionResults['giga_star'] = $gigaStarResult;

            // Update global_pools records to mark them as processed
            $updatedGlobalPools = $this->markGlobalPoolsAsProcessed($startOfMonth, $endOfMonth);
            
            // Commit transaction
            DB::commit();

            $response = [
                'success' => true,
                'message' => 'Global pool distribution completed successfully',
                'data' => [
                    'total_amount' => $totalAmount,
                    'record_count' => $recordCount,
                    'distribution_amounts' => [
                        'seven_star_amount' => $sevenStarAmount,
                        'mega_star_amount' => $megaStarAmount,
                        'giga_star_amount' => $gigaStarAmount,
                    ],
                    'distribution_results' => $distributionResults,
                    'global_pools_updated' => $updatedGlobalPools,
                    'date_range' => [
                        'from_date' => $startOfMonth->toDateTimeString(),
                        'to_date' => $endOfMonth->toDateTimeString(),
                    ],
                    'id_range' => [
                        'from_id' => $idRange->min_id ?? null,
                        'to_id' => $idRange->max_id ?? null,
                    ],
                    'filters' => [
                        'countStatus' => 0,
                        'status' => 0,
                        'created_at_between' => [
                            $startOfMonth->toDateTimeString(),
                            $endOfMonth->toDateTimeString()
                        ]
                    ]
                ],
                'timestamp' => now()->toDateTimeString()
            ];

            Log::info('Global Pool Distribution Cron Completed Successfully', [
                'total_amount' => $totalAmount,
                'distribution_results' => $distributionResults,
                'date_range' => [
                    'from' => $startOfMonth->toDateTimeString(),
                    'to' => $endOfMonth->toDateTimeString()
                ]
            ]);

            return response()->json($response);

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Global Pool Distribution Cron Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process global pool distribution',
                'error' => $e->getMessage(),
                'timestamp' => now()->toDateTimeString()
            ], 500);
        }
    }

    /**
     * Process badge distribution for a specific badge type
     */
    private function processBadgeDistribution($badgeType, $amount, $badgeTable)
    {
        try {
            // Count total users for this badge type
            $totalUsers = DB::table($badgeTable)->count();
            
            if ($totalUsers == 0) {
                Log::warning("No users found for {$badgeType} star badge", ['badge_table' => $badgeTable]);
                return [
                    'badge_type' => $badgeType,
                    'total_users' => 0,
                    'distribution_amount_each' => 0,
                    'earnings_created' => 0,
                    'message' => "No users found for {$badgeType} star badge"
                ];
            }

            // Calculate distribution amount per user
            $distributionAmountEach = $amount / $totalUsers;

            Log::info("Processing {$badgeType} star distribution", [
                'badge_table' => $badgeTable,
                'total_amount' => $amount,
                'total_users' => $totalUsers,
                'distribution_amount_each' => $distributionAmountEach
            ]);

            // Fetch all users for this badge type
            $badgeUsers = DB::table($badgeTable)->get();
            
            $earningsCreated = 0;

            // Process each user
            foreach ($badgeUsers as $badgeUser) {
                $currentUserId = $badgeUser->user_id;

                // Only create earnings record if amount is greater than 0
                if ($distributionAmountEach > 0) {
                    Log::info("Creating earnings record for {$badgeType} star user", [
                        'user_id' => $currentUserId,
                        'amount' => $distributionAmountEach,
                        'badge_type' => $badgeType
                    ]);

                    try {
                        // Insert earnings record
                        $earningsData = [
                            'user_id' => $currentUserId,
                            'order_id' => null,
                            'user_trigger_id' => $currentUserId,
                            'earning_name' => 'Global Pool Earning',
                            'earning_type' => 'Global Pool',
                            'earning_description' => 'Global Pool Earning Amount',
                            'ammout' => $distributionAmountEach,
                            'debit_credit' => 2, // Credit
                            'transation_type' => 1, // Earning
                            'withdrawal_status' => 0, // Pending
                            'redistribution_status' => 0, // Not distributed
                            'status' => 1,
                            'deleteStatus' => 0,
                            'countStatus' => 0,
                            'created_at' => now(),
                            'updated_at' => now()
                        ];

                        $insertedId = DB::table('earnings')->insertGetId($earningsData);
                        
                        Log::info("Earnings record created successfully", [
                            'inserted_id' => $insertedId,
                            'user_id' => $currentUserId,
                            'amount' => $distributionAmountEach
                        ]);

                        $earningsCreated++;

                    } catch (\Exception $e) {
                        Log::error("Failed to create earnings record", [
                            'user_id' => $currentUserId,
                            'error' => $e->getMessage(),
                            'earnings_data' => $earningsData
                        ]);
                        throw $e;
                    }
                } else {
                    Log::info("Skipping earnings record creation for {$badgeType} star user - amount is zero or negative", [
                        'user_id' => $currentUserId,
                        'amount' => $distributionAmountEach,
                        'badge_type' => $badgeType
                    ]);
                }
            }

            Log::info("{$badgeType} star distribution completed", [
                'badge_type' => $badgeType,
                'total_users' => $totalUsers,
                'distribution_amount_each' => $distributionAmountEach,
                'earnings_created' => $earningsCreated
            ]);

            return [
                'badge_type' => $badgeType,
                'total_users' => $totalUsers,
                'distribution_amount_each' => $distributionAmountEach,
                'earnings_created' => $earningsCreated,
                'message' => "Successfully distributed {$badgeType} star earnings to {$earningsCreated} users"
            ];

        } catch (\Exception $e) {
            Log::error("Failed to process {$badgeType} star distribution", [
                'badge_table' => $badgeTable,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }

    /**
     * Mark global pools records as processed
     */
    private function markGlobalPoolsAsProcessed($startOfMonth, $endOfMonth)
    {
        try {
            Log::info('Marking global pools records as processed', [
                'start_date' => $startOfMonth->toDateTimeString(),
                'end_date' => $endOfMonth->toDateTimeString()
            ]);

            // Update global_pools records where countStatus=0 and status=0
            $updatedCount = DB::table('global_pools')
                ->where('countStatus', 0)
                ->where('status', 0)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->update([
                    'countStatus' => 1, // Mark as counted/processed
                    'status' => 1,      // Mark as active/processed
                    'updated_at' => now()
                ]);

            Log::info('Global pools records marked as processed', [
                'updated_count' => $updatedCount,
                'start_date' => $startOfMonth->toDateTimeString(),
                'end_date' => $endOfMonth->toDateTimeString()
            ]);

            return [
                'updated_count' => $updatedCount,
                'message' => "Successfully marked {$updatedCount} global pools records as processed",
                'date_range' => [
                    'from_date' => $startOfMonth->toDateTimeString(),
                    'to_date' => $endOfMonth->toDateTimeString(),
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Failed to mark global pools records as processed', [
                'error' => $e->getMessage(),
                'start_date' => $startOfMonth->toDateTimeString(),
                'end_date' => $endOfMonth->toDateTimeString()
            ]);
            
            throw $e;
        }
    }
}