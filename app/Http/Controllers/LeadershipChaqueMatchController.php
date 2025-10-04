<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Order;
use App\Models\MemberUplineRank;
use App\Models\Earning;
use App\Models\GlobalPool;

class LeadershipChaqueMatchController extends Controller
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
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
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
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $chaqueMatchResult = $this->chaqueMatchDistribution($dhaulagiriEarning);
                $distributionResults['dhaulagiri'] = [
                    'earning_id' => $dhaulagiriEarning->id,
                    'user_id' => $memberUplineRank->five_star_user_id,
                    'amount' => $dhaulagiriAmount,
                    'chaque_match_result' => $chaqueMatchResult
                ];
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
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $chaqueMatchResult = $this->chaqueMatchDistribution($makaluEarning);
                $distributionResults['makalu'] = [
                    'earning_id' => $makaluEarning->id,
                    'user_id' => $memberUplineRank->seven_star_user_id,
                    'amount' => $makaluAmount,
                    'chaque_match_result' => $chaqueMatchResult
                ];
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
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $chaqueMatchResult = $this->chaqueMatchDistribution($kanchenjungaEarning);
                $distributionResults['kanchenjunga'] = [
                    'earning_id' => $kanchenjungaEarning->id,
                    'user_id' => $memberUplineRank->mega_star_user_id,
                    'amount' => $kanchenjungaAmount,
                    'chaque_match_result' => $chaqueMatchResult
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
                    'status' => 1,
                    'deleteStatus' => 0,
                    'countStatus' => 0
                ]);

                $chaqueMatchResult = $this->chaqueMatchDistribution($mountEverestEarning);
                $distributionResults['mount_everest'] = [
                    'earning_id' => $mountEverestEarning->id,
                    'user_id' => $memberUplineRank->giga_star_user_id,
                    'amount' => $mountEverestAmount,
                    'chaque_match_result' => $chaqueMatchResult
                ];
            }

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
     * Chaque Match Distribution (placeholder function)
     */
    private function chaqueMatchDistribution($earningData)
    {
        try {
            // For now, simply return the earning data
            // This function will be modified later as per requirements
            
            return [
                'success' => true,
                'earning_id' => $earningData->id,
                'earning_name' => $earningData->earning_name,
                'earning_type' => $earningData->earning_type,
                'amount' => $earningData->ammout,
                'user_id' => $earningData->user_id,
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
}