<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\MemberUplineRank;
use App\Models\Earning;
use App\Models\GlobalPool;

class CronLeadershipChaqueMatchController extends Controller
{
    /**
     * Cron job to process leadership chaque match
     * Fetches orders from orders table with specific criteria
     */
    public function cronLeadershipChaqueMatch()
    {
        try {
            // Note: The following fields need to be added to the orders table structure:
            // - free_paid_member_status (tinyInteger)
            // - leadership_status (tinyInteger)  
            // - chaque_match_status (tinyInteger)
            // - tax_status (tinyInteger)
            
            // Fetch orders with specified conditions using Eloquent for relationships
            $orders = Order::where('customerType', 'member')
                ->where('free_paid_member_status', 1)
                ->where('paymentStatus', 1)
                ->where('leadership_status', 0)
                ->where('chaque_match_status', 0)
                ->where('tax_status', 0)
                ->where('deleteStatus', 0) // Exclude deleted records
                ->with(['memberUser']) // Load member user relationship
                ->orderBy('id', 'asc') // Order by ID ascending
                ->get();

            // Log the cron job execution
            Log::info('Leadership Chaque Match Cron executed', [
                'total_orders_found' => $orders->count(),
                'execution_time' => now()->toDateTimeString()
            ]);
            
            // Debug: Log order details if any orders found
            if ($orders->count() > 0) {
                Log::info('Orders found for processing:', [
                    'order_ids' => $orders->pluck('id')->toArray(),
                    'member_user_ids' => $orders->pluck('memberUserId')->toArray()
                ]);
            } else {
                Log::info('No orders found matching criteria');
                return response()->json([
                    'success' => true,
                    'message' => 'No orders found matching the specified criteria',
                    'total_orders' => 0,
                    'processed_orders' => 0,
                    'execution_time' => now()->toDateTimeString()
                ]);
            }

            // Process each order
            $processedOrders = [];
            foreach ($orders as $order) {
                // Fetch member upline rank data for this member
                $memberUplineRank = MemberUplineRank::where('user_id', $order->memberUserId)->first();
                
                // Process commission distribution
                $globalPoolResult = $this->globalPoolSave($order, $memberUplineRank);
                $leadershipResult = $this->leaderShipDistribution($order, $memberUplineRank);
                
                $processedOrders[] = [
                    'order_id' => $order->id,
                    'customer_type' => $order->customerType,
                    'member_user_id' => $order->memberUserId,
                    'payment_status' => $order->paymentStatus,
                    'order_total' => $order->sellingPrice ?? 0,
                    'user_commission_amount' => $order->userCommissionAmount ?? 0,
                    'member_upline_rank' => $memberUplineRank ? [
                        'id' => $memberUplineRank->id,
                        'user_id' => $memberUplineRank->user_id,
                        'refferal_user_id' => $memberUplineRank->refferal_user_id,
                        'three_star_user_id' => $memberUplineRank->three_star_user_id,
                        'five_star_user_id' => $memberUplineRank->five_star_user_id,
                        'seven_star_user_id' => $memberUplineRank->seven_star_user_id,
                        'mega_star_user_id' => $memberUplineRank->mega_star_user_id,
                        'giga_star_user_id' => $memberUplineRank->giga_star_user_id,
                        'created_at' => $memberUplineRank->created_at,
                        'updated_at' => $memberUplineRank->updated_at,
                    ] : null,
                    'global_pool_result' => $globalPoolResult,
                    'leadership_result' => $leadershipResult,
                    'processed_at' => now()->toDateTimeString()
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Leadership Chaque Match cron job executed successfully',
                'data' => [
                    'total_orders_found' => $orders->count(),
                    'processed_orders_count' => count($processedOrders),
                    'processed_orders' => $processedOrders,
                    'execution_timestamp' => now()->toDateTimeString()
                ]
            ], 200, [
                'Content-Type' => 'application/json',
                'Cache-Control' => 'no-cache'
            ], JSON_PRETTY_PRINT);

        } catch (\Exception $e) {
            // Log the error
            Log::error('Leadership Chaque Match Cron job failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'execution_time' => now()->toDateTimeString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Leadership Chaque Match cron job failed: ' . $e->getMessage(),
                'data' => null,
                'error_details' => [
                    'error_message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500, [
                'Content-Type' => 'application/json',
                'Cache-Control' => 'no-cache'
            ], JSON_PRETTY_PRINT);
        }
    }

    /**
     * Save 20% of user commission to global pools
     */
    private function globalPoolSave($order, $memberUplineRank)
    {
        try {
            $userCommissionAmount = floatval($order->userCommissionAmount) ?? 0;
            $globalBonusAmount = $userCommissionAmount * 0.20; // 20% of user commission

            $globalPool = GlobalPool::create([
                'user_id' => $order->memberUserId,
                'order_id' => $order->id,
                'user_trigger_id' => $order->memberUserId,
                'earning_name' => 'Global Pool',
                'earning_description' => 'Global Pool Fund',
                'ammout' => $globalBonusAmount,
                'status' => 0,
                'deleteStatus' => 0,
                'countStatus' => 0
            ]);

            return [
                'success' => true,
                'global_pool_id' => $globalPool->id,
                'global_bonus_amount' => $globalBonusAmount
            ];

        } catch (\Exception $e) {
            Log::error('Global Pool Save Failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Distribute 80% of user commission among leadership levels
     */
    private function leaderShipDistribution($order, $memberUplineRank)
    {
        try {
            $userCommissionAmount = floatval($order->userCommissionAmount) ?? 0;
            $totalLeadershipAmount = $userCommissionAmount * 0.80; // 80% of user commission

            $distributionResults = [];

            // Annapurna Earning (Referral - 15%)
            if ($memberUplineRank && $memberUplineRank->refferal_user_id) {
                $annapurnaAmount = $totalLeadershipAmount * 0.15; // 15% of leadership amount
                
                $annapurnaEarning = Earning::create([
                    'user_id' => $memberUplineRank->refferal_user_id,
                    'order_id' => $order->id,
                    'user_trigger_id' => $order->memberUserId,
                    'earning_name' => 'Annapurna Earning',
                    'earning_type' => 'Referral',
                    'earning_description' => 'Referral Earning - #' . $order->id,
                    'ammout' => $annapurnaAmount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $distributionResults['annapurna'] = [
                    'earning_id' => $annapurnaEarning->id,
                    'user_id' => $memberUplineRank->refferal_user_id,
                    'amount' => $annapurnaAmount
                ];
            }

            // Manaslu Earning (Leadership - 15%)  
            if ($memberUplineRank && $memberUplineRank->three_star_user_id) {
                $manasluAmount = $totalLeadershipAmount * 0.15; // 15% of leadership amount
                
                $manasluEarning = Earning::create([
                    'user_id' => $memberUplineRank->three_star_user_id,
                    'order_id' => $order->id,
                    'user_trigger_id' => $order->memberUserId,
                    'earning_name' => 'Manaslu Earning',
                    'earning_type' => 'LeaderShip',
                    'earning_description' => 'Manaslu Earning - #' . $order->id,
                    'ammout' => $manasluAmount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                Log::info('Calling chaqueMatchDistribution for Manaslu Earning', [
                    'earning_id' => $manasluEarning->id,
                    'user_id' => $manasluEarning->user_id,
                    'amount' => $manasluEarning->ammout
                ]);
                $chaqueMatchResult = $this->chaqueMatchDistribution($manasluEarning);
                $distributionResults['manaslu'] = [
                    'earning_id' => $manasluEarning->id,
                    'user_id' => $memberUplineRank->three_star_user_id,
                    'amount' => $manasluAmount,
                    'chaque_match_result' => $chaqueMatchResult
                ];
            }

            // Dhaulagiri Earning (Leadership - 10%)
            if ($memberUplineRank && $memberUplineRank->five_star_user_id) {
                $dhaulagiriAmount = $totalLeadershipAmount * 0.10; // 10% of leadership amount
                
                $dhaulagiriEarning = Earning::create([
                    'user_id' => $memberUplineRank->five_star_user_id,
                    'order_id' => $order->id,
                    'user_trigger_id' => $order->memberUserId,
                    'earning_name' => 'Dhaulagiri Earning',
                    'earning_type' => 'LeaderShip',
                    'earning_description' => 'Dhaulagiri Earning - #' . $order->id,
                    'ammout' => $dhaulagiriAmount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                Log::info('Calling chaqueMatchDistribution for Dhaulagiri Earning', [
                    'earning_id' => $dhaulagiriEarning->id,
                    'user_id' => $dhaulagiriEarning->user_id,
                    'amount' => $dhaulagiriEarning->ammout
                ]);
                $chaqueMatchResult = $this->chaqueMatchDistribution($dhaulagiriEarning);
                $distributionResults['dhaulagiri'] = [
                    'earning_id' => $dhaulagiriEarning->id,
                    'user_id' => $memberUplineRank->five_star_user_id,
                    'amount' => $dhaulagiriAmount,
                    'chaque_match_result' => $chaqueMatchResult
                ];
            } else {
                Log::info('Dhaulagiri Earning skipped - no five_star_user_id', [
                    'order_id' => $order->id,
                    'member_user_id' => $order->memberUserId,
                    'five_star_user_id' => $memberUplineRank ? $memberUplineRank->five_star_user_id : 'N/A'
                ]);
            }

            // Makalu Earning (Leadership - 5%)
            if ($memberUplineRank && $memberUplineRank->seven_star_user_id) {
                $makaluAmount = $totalLeadershipAmount * 0.05; // 5% of leadership amount
                
                $makaluEarning = Earning::create([
                    'user_id' => $memberUplineRank->seven_star_user_id,
                    'order_id' => $order->id,
                    'user_trigger_id' => $order->memberUserId,
                    'earning_name' => 'Makalu Earning',
                    'earning_type' => 'LeaderShip',
                    'earning_description' => 'Makalu Earning - #' . $order->id,
                    'ammout' => $makaluAmount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                Log::info('Calling chaqueMatchDistribution for Makalu Earning', [
                    'earning_id' => $makaluEarning->id,
                    'user_id' => $makaluEarning->user_id,
                    'amount' => $makaluEarning->ammout
                ]);
                $chaqueMatchResult = $this->chaqueMatchDistribution($makaluEarning);
                $distributionResults['makalu'] = [
                    'earning_id' => $makaluEarning->id,
                    'user_id' => $memberUplineRank->seven_star_user_id,
                    'amount' => $makaluAmount,
                    'chaque_match_result' => $chaqueMatchResult
                ];
            } else {
                Log::info('Makalu Earning skipped - no seven_star_user_id', [
                    'order_id' => $order->id,
                    'member_user_id' => $order->memberUserId,
                    'seven_star_user_id' => $memberUplineRank ? $memberUplineRank->seven_star_user_id : 'N/A'
                ]);
            }

            // Kanchenjunga Earning (Leadership - 2%)
            if ($memberUplineRank && $memberUplineRank->mega_star_user_id) {
                $kanchenjungaAmount = $totalLeadershipAmount * 0.02; // 2% of leadership amount
                
                $kanchenjungaEarning = Earning::create([
                    'user_id' => $memberUplineRank->mega_star_user_id,
                    'order_id' => $order->id,
                    'user_trigger_id' => $order->memberUserId,
                    'earning_name' => 'Kanchenjunga Earning',
                    'earning_type' => 'LeaderShip',
                    'earning_description' => 'Kanchenjunga Earning - #' . $order->id,
                    'ammout' => $kanchenjungaAmount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $distributionResults['kanchenjunga'] = [
                    'earning_id' => $kanchenjungaEarning->id,
                    'user_id' => $memberUplineRank->mega_star_user_id,
                    'amount' => $kanchenjungaAmount
                ];
            }

            // Mount Everest Earning (Leadership - 2%)
            if ($memberUplineRank && $memberUplineRank->giga_star_user_id) {
                $mountEverestAmount = $totalLeadershipAmount * 0.02; // 2% of leadership amount
                
                $mountEverestEarning = Earning::create([
                    'user_id' => $memberUplineRank->giga_star_user_id,
                    'order_id' => $order->id,
                    'user_trigger_id' => $order->memberUserId,
                    'earning_name' => 'Mount Everest Earning',
                    'earning_type' => 'LeaderShip',
                    'earning_description' => 'Mount Everest Earning - #' . $order->id,
                    'ammout' => $mountEverestAmount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $distributionResults['mount_everest'] = [
                    'earning_id' => $mountEverestEarning->id,
                    'user_id' => $memberUplineRank->giga_star_user_id,
                    'amount' => $mountEverestAmount
                ];
            }

            // Update leadership_status to 1 in orders table after all distributions are saved
            Order::where('id', $order->id)->update(['leadership_status' => 1]);
            
            Log::info('Updated order leadership_status', [
                'order_id' => $order->id,
                'leadership_status' => 1
            ]);

            return [
                'success' => true,
                'total_leadership_amount' => $totalLeadershipAmount,
                'distributions' => $distributionResults
            ];

        } catch (\Exception $e) {
            Log::error('Leadership Distribution Failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Chaque Match Distribution
     */
    private function chaqueMatchDistribution($earningData)
    {
        try {
            // Store chaque_match_result.amount in const
            $chaque_match_total_amount = $earningData->ammout;
            
            // Set current leadership details
            $current_leadership_id = $earningData->user_id;
            $current_earning_type = $earningData->earning_name;
            
            Log::info('Starting Chaque Match Distribution', [
                'earning_id' => $earningData->id,
                'current_leadership_id' => $current_leadership_id,
                'current_earning_type' => $current_earning_type,
                'chaque_match_total_amount' => $chaque_match_total_amount
            ]);
            
            $upline_levels = [];
            
            // Start from the current leadership user's upline (not the user itself)
            $starting_user = DB::table('users')->where('id', $current_leadership_id)->first();
            
            if (!$starting_user || !$starting_user->referred_by) {
                Log::info('No starting upline found for current leadership user', [
                    'current_leadership_id' => $current_leadership_id,
                    'has_referred_by' => $starting_user ? (bool)$starting_user->referred_by : false
                ]);
                
                return [
                    'success' => true,
                    'earning_id' => $earningData->id,
                    'earning_name' => $earningData->earning_name,
                    'earning_type' => $earningData->earning_type,
                    'amount' => $earningData->ammout,
                    'user_id' => $earningData->user_id,
                    'chaque_match_total_amount' => $chaque_match_total_amount,
                    'current_leadership_id' => $current_leadership_id,
                    'current_earning_type' => $current_earning_type,
                    'upline_levels' => [],
                    'message' => 'No upline found for current user',
                    'processed_at' => now()->toDateTimeString()
                ];
            }
            
            $current_upline_id = $starting_user->referred_by;
            
            // Find 7 levels of upline paid members and create Chaque Match earnings
            for ($level = 1; $level <= 7; $level++) {
                
                // Find the next paid member in the upline
                $paid_upline_id = $this->findNextPaidUpline($current_upline_id);
                
                if (!$paid_upline_id) {
                    Log::info('No paid upline found, stopping search', [
                        'level' => $level,
                        'searched_from_id' => $current_upline_id
                    ]);
                    break;
                }
                
                // Store level information
                $upline_levels[] = [
                    'level' => $level,
                    'upline_id' => $paid_upline_id,
                    'searched_from' => $current_upline_id
                ];
                
                Log::info("Level: {$level} and First level id: {$paid_upline_id}", [
                    'level' => $level,
                    'paid_upline_id' => $paid_upline_id,
                    'searched_from' => $current_upline_id
                ]);
                
                // Debug: Log the user details for the found paid member
                $found_user = DB::table('users')->where('id', $paid_upline_id)->first();
                if ($found_user) {
                    Log::info('Found paid user details', [
                        'user_id' => $found_user->id,
                        'member_type' => $found_user->member_type,
                        'referred_by' => $found_user->referred_by,
                        'first_name' => $found_user->first_name ?? 'N/A',
                        'last_name' => $found_user->last_name ?? 'N/A'
                    ]);
                }
                
                // Check eligibility for Chaque Match and create earning record
                $to_chaque_id = $this->checkChaqueMatchEligibility($level, $paid_upline_id);
                
                // Calculate amount based on level (15% for levels 1-6, 10% for level 7)
                $percentage = ($level == 7) ? 0.10 : 0.15;
                $chaque_match_amount = $chaque_match_total_amount * $percentage;
                
                // Create earning record for Chaque Match
                $chaque_earning = Earning::create([
                    'user_id' => $to_chaque_id,
                    'order_id' => $earningData->order_id,
                    'user_trigger_id' => $earningData->user_trigger_id,
                    'earning_name' => 'Chaque Match - ' . $level . 'st Level',
                    'earning_type' => 'Chaque Match',
                    'earning_description' => 'Chaque Match - ' . $level . 'st Level - #' . $earningData->order_id,
                    'ammout' => $chaque_match_amount,
                    'debit_credit' => 2, // Credit
                    'transation_type' => 1, // Earning
                    'withdrawal_status' => 0, // Pending
                    'redistribution_status' => 0, // Not distributed
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);
                
                Log::info('Created Chaque Match earning', [
                    'level' => $level,
                    'earning_id' => $chaque_earning->id,
                    'to_chaque_id' => $to_chaque_id,
                    'original_upline_id' => $paid_upline_id,
                    'amount' => $chaque_match_amount,
                    'percentage' => ($percentage * 100) . '%',
                    'eligible' => $to_chaque_id === $paid_upline_id ? 'Yes' : 'No (defaulted to admin)'
                ]);
                
                // Move to next level - find the upline of the current paid member
                $next_user = DB::table('users')->where('id', $paid_upline_id)->first();
                if (!$next_user) {
                    Log::info('User not found for paid upline', [
                        'level' => $level,
                        'paid_upline_id' => $paid_upline_id
                    ]);
                    break;
                }
                
                Log::info('Checking next user for upline', [
                    'level' => $level,
                    'current_paid_user_id' => $paid_upline_id,
                    'next_user_referred_by' => $next_user->referred_by,
                    'next_user_member_type' => $next_user->member_type
                ]);
                
                if (!$next_user->referred_by) {
                    Log::info('No more upline found for paid member - breaking loop', [
                        'level' => $level,
                        'paid_upline_id' => $paid_upline_id,
                        'referred_by' => $next_user->referred_by,
                        'reason' => 'referred_by is null or empty'
                    ]);
                    break;
                }
                
                $current_upline_id = $next_user->referred_by;
                Log::info('Moving to next level', [
                    'level' => $level,
                    'new_current_upline_id' => $current_upline_id
                ]);
            }
            
            // Get the created Chaque Match earnings for this distribution
            $chaque_earnings = Earning::where('earning_type', 'Chaque Match')
                ->where('user_trigger_id', $earningData->user_trigger_id)
                ->where('order_id', $earningData->order_id)
                ->orderBy('id', 'desc')
                ->limit(count($upline_levels))
                ->get();

            // Update chaque_match_status to 1 in orders table after all Chaque Match distributions are saved
            Order::where('id', $earningData->order_id)->update(['chaque_match_status' => 1]);
            
            Log::info('Updated order chaque_match_status', [
                'order_id' => $earningData->order_id,
                'chaque_match_status' => 1
            ]);

            return [
                'success' => true,
                'earning_id' => $earningData->id,
                'earning_name' => $earningData->earning_name,
                'earning_type' => $earningData->earning_type,
                'amount' => $earningData->ammout,
                'user_id' => $earningData->user_id,
                'chaque_match_total_amount' => $chaque_match_total_amount,
                'current_leadership_id' => $current_leadership_id,
                'current_earning_type' => $current_earning_type,
                'upline_levels' => $upline_levels,
                'chaque_match_earnings' => $chaque_earnings,
                'processed_at' => now()->toDateTimeString()
            ];

        } catch (\Exception $e) {
            Log::error('Chaque Match Distribution Failed', [
                'earning_id' => $earningData->id ?? 'unknown',
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Find the next paid upline member
     */
    private function findNextPaidUpline($startUserId)
    {
        $current_id = $startUserId;
        $max_iterations = 50; // Prevent infinite loops
        $iteration = 0;
        
        Log::info('Starting paid upline search', [
            'start_user_id' => $startUserId
        ]);
        
        while ($current_id && $iteration < $max_iterations) {
            
            // Get user details
            $user = DB::table('users')->where('id', $current_id)->first();
            
            if (!$user) {
                Log::warning('User not found in findNextPaidUpline', [
                    'user_id' => $current_id
                ]);
                return null;
            }
            
            Log::info('Checking user in upline search', [
                'user_id' => $current_id,
                'member_type' => $user->member_type,
                'referred_by' => $user->referred_by,
                'iteration' => $iteration
            ]);
            
            // Check if current user is paid
            if ($user->member_type == 'paid') {
                Log::info('Found paid member in upline search', [
                    'paid_user_id' => $current_id,
                    'iterations_checked' => $iteration
                ]);
                return $current_id;
            }
            
            // If free, move to next upline
            if ($user->member_type == 'free' && $user->referred_by) {
                $current_id = $user->referred_by;
                $iteration++;
            } else {
                // No more upline to check
                Log::info('No more upline to check', [
                    'current_id' => $current_id,
                    'member_type' => $user->member_type,
                    'has_referred_by' => (bool)$user->referred_by
                ]);
                return null;
            }
        }
        
        Log::warning('Max iterations reached in findNextPaidUpline', [
            'start_user_id' => $startUserId,
            'max_iterations' => $max_iterations
        ]);
        
        return null;
    }
    
    /**
     * Check eligibility for Chaque Match based on level criteria
     */
    private function checkChaqueMatchEligibility($level, $upline_id)
    {
        $to_chaque_id = 1; // Default to admin ID
        
        switch ($level) {
            case 1:
                // Level 1: Check if user has activeStatus = 1
                $count = DB::table('users')
                    ->where('id', $upline_id)
                    ->where('activeStatus', 1)
                    ->count();
                
                if ($count >= 1) {
                    $to_chaque_id = $upline_id;
                }
                break;
                
            case 2:
            case 3:
                // Level 2 & 3: Check badge_three_stars table
                $count = DB::table('badge_three_stars')
                    ->where('user_id', $upline_id)
                    ->count();
                
                if ($count >= 1) {
                    $to_chaque_id = $upline_id;
                }
                break;
                
            case 4:
            case 5:
                // Level 4 & 5: Check badge_five_stars table
                $count = DB::table('badge_five_stars')
                    ->where('user_id', $upline_id)
                    ->count();
                
                if ($count >= 1) {
                    $to_chaque_id = $upline_id;
                }
                break;
                
            case 6:
            case 7:
                // Level 6 & 7: Check badge_seven_stars table
                $count = DB::table('badge_seven_stars')
                    ->where('user_id', $upline_id)
                    ->count();
                
                if ($count >= 1) {
                    $to_chaque_id = $upline_id;
                }
                break;
        }
        
        Log::info('Chaque Match eligibility check', [
            'level' => $level,
            'upline_id' => $upline_id,
            'to_chaque_id' => $to_chaque_id,
            'eligible' => $to_chaque_id === $upline_id
        ]);
        
        return $to_chaque_id;
    }
    
    /**
     * Test function to debug chaqueMatchDistribution
     */
    public function testChaqueMatchDistribution()
    {
        try {
            // Get a recent earning record to test with
            $testEarning = Earning::where('earning_name', 'LIKE', '%Earning%')
                ->orderBy('id', 'desc')
                ->first();
            
            if (!$testEarning) {
                return response()->json([
                    'success' => false,
                    'message' => 'No test earning found'
                ]);
            }
            
            Log::info('Testing chaqueMatchDistribution with earning:', [
                'earning_id' => $testEarning->id,
                'user_id' => $testEarning->user_id,
                'earning_name' => $testEarning->earning_name,
                'amount' => $testEarning->ammout
            ]);
            
            $result = $this->chaqueMatchDistribution($testEarning);
            
            return response()->json([
                'success' => true,
                'test_earning' => $testEarning,
                'result' => $result
            ]);
            
        } catch (\Exception $e) {
            Log::error('Test chaqueMatchDistribution failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}