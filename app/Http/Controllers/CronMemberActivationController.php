<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\PackageOffer;
use App\Models\User;
use App\Models\Transaction;
use App\Models\MemberUplineRank;
use App\Models\BadgeThreeStars;
use App\Models\BadgeFiveStars;
use App\Models\BadgeSevenStars;
use App\Models\BadgeMegaStars;
use App\Models\BadgeGigaStars;

class CronMemberActivationController extends Controller
{
    /**
     * Activate member package - Find free members who can upgrade
     */
    public function activateMemberPackage()
    {
        try {
            // Step 1: Find the latest active package from package_offers table
            // Check if today's date is between valid_from_date and valid_to_date
            $today = now()->toDateString();
            
            $latestPackage = PackageOffer::where('status', 1)
                ->where(function ($query) use ($today) {
                    $query->whereNull('valid_from_date')
                          ->orWhere('valid_from_date', '<=', $today);
                })
                ->where(function ($query) use ($today) {
                    $query->whereNull('valid_to_date')
                          ->orWhere('valid_to_date', '>=', $today);
                })
                ->orderBy('id', 'desc')
                ->first();

            if (!$latestPackage) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active package found',
                    'data' => null
                ]);
            }

            $packageAmount = $latestPackage->package_amount;

            // Step 2: Find all free members in ascending order by ID
            $freeMembers = User::where('user_type', 'member')
                ->where('member_type', 'free')
                ->orderBy('id', 'asc')
                ->get();

            $eligibleUsers = [];

            // Step 3: Calculate account balance for each free member and process eligible users
            foreach ($freeMembers as $user) {
                $accountBalance = $this->calculateAccountBalance($user->id);
                
                // Step 4: Check if user has sufficient balance
                if ($accountBalance >= $packageAmount) {
                    try {
                        // Fetch current status flags from user
                        $currentUser = User::find($user->id);
                        $rankFindStatus = $currentUser->rankFindStatus;
                        $promotionRunStatus = $currentUser->promotionRunStatus;
                        
                        $uplineRankResult = null;
                        $promotionResult = null;
                        
                        // Only run findUplineRank if rankFindStatus = 0
                        if ($rankFindStatus == 0) {
                            $uplineRankResult = $this->findUplineRank($user->id, $packageAmount);
                            // Update rankFindStatus to 1 after completion
                            $currentUser->update(['rankFindStatus' => 1]);
                        } else {
                            $uplineRankResult = [
                                'skipped' => true,
                                'message' => 'Rank find already completed',
                                'rankFindStatus' => $rankFindStatus
                            ];
                        }
                        
                        // Only run memberPromotion if promotionRunStatus = 0
                        if ($promotionRunStatus == 0) {
                            $promotionResult = $this->memberPromotion($user->id);
                            // Update promotionRunStatus to 1 after completion
                            $currentUser->update(['promotionRunStatus' => 1]);
                        } else {
                            $promotionResult = [
                                'skipped' => true,
                                'message' => 'Promotion run already completed',
                                'promotionRunStatus' => $promotionRunStatus
                            ];
                        }
                        
                        // Finally, update member_type to 'paid' and activeStatus to 1
                        $currentUser->update([
                            'member_type' => 'paid',
                            'activeStatus' => 1
                        ]);
                        
                        $eligibleUsers[] = [
                            'user_id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => $user->phone,
                            'referral_code' => $user->referral_code,
                            'account_balance' => $accountBalance,
                            'package_amount' => $packageAmount,
                            'can_upgrade' => true,
                            'excess_amount' => $accountBalance - $packageAmount,
                            'initial_rankFindStatus' => $rankFindStatus,
                            'initial_promotionRunStatus' => $promotionRunStatus,
                            'upline_rank_result' => $uplineRankResult,
                            'promotion_result' => $promotionResult,
                            'member_type_updated' => 'paid',
                            'activeStatus_updated' => 1
                        ];
                    } catch (\Exception $e) {
                        // Log error but continue with other users
                        Log::error("Error processing user {$user->id}: " . $e->getMessage());
                        
                        $eligibleUsers[] = [
                            'user_id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => $user->phone,
                            'referral_code' => $user->referral_code,
                            'account_balance' => $accountBalance,
                            'package_amount' => $packageAmount,
                            'can_upgrade' => true,
                            'excess_amount' => $accountBalance - $packageAmount,
                            'error' => $e->getMessage()
                        ];
                    }
                }
            }

            // Step 5: Return the results
            return response()->json([
                'success' => true,
                'message' => 'Package activation analysis completed',
                'data' => [
                    'latest_package' => [
                        'id' => $latestPackage->id,
                        'package_name' => $latestPackage->package_name,
                        'package_amount' => $latestPackage->package_amount,
                        'status' => $latestPackage->status,
                        'status_text' => $latestPackage->status_text,
                        'valid_from_date' => $latestPackage->valid_from_date,
                        'valid_to_date' => $latestPackage->valid_to_date,
                        'created_at' => $latestPackage->created_at
                    ],
                    'total_free_members' => $freeMembers->count(),
                    'eligible_users_count' => count($eligibleUsers),
                    'eligible_users' => $eligibleUsers
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error processing package activation: ' . $e->getMessage(),
                'data' => null
            ], 500);
        }
    }

    /**
     * Get latest active package (API endpoint for LatestActivePackageCard.jsx)
     */
    public function getLatestActivePackage()
    {
        try {
            // Check if today's date is between valid_from_date and valid_to_date
            $today = now()->toDateString();
            
            $latestPackage = PackageOffer::where('status', 1)
                ->where(function ($query) use ($today) {
                    $query->whereNull('valid_from_date')
                          ->orWhere('valid_from_date', '<=', $today);
                })
                ->where(function ($query) use ($today) {
                    $query->whereNull('valid_to_date')
                          ->orWhere('valid_to_date', '>=', $today);
                })
                ->orderBy('id', 'desc')
                ->first();

            if (!$latestPackage) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active package found',
                    'package' => null
                ]);
            }

            return response()->json([
                'success' => true,
                'package' => [
                    'id' => $latestPackage->id,
                    'package_name' => $latestPackage->package_name,
                    'package_amount' => $latestPackage->package_amount,
                    'status' => $latestPackage->status,
                    'status_text' => $latestPackage->status_text,
                    'valid_from_date' => $latestPackage->valid_from_date,
                    'valid_to_date' => $latestPackage->valid_to_date,
                    'created_at' => $latestPackage->created_at
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching latest package: ' . $e->getMessage(),
                'package' => null
            ], 500);
        }
    }

    /**
     * Calculate account balance for a user based on transactions
     * Following the logic from TransactionController
     */
    private function calculateAccountBalance($userId)
    {
        // Get all transactions where user is the recipient, ordered by creation date
        $transactions = Transaction::where('transaction_to_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        $balance = 0;

        foreach ($transactions as $transaction) {
            if ($transaction->debit_credit == 1) {
                // Debit - subtract from balance
                $balance -= $transaction->amount;
            } elseif ($transaction->debit_credit == 2) {
                // Credit - add to balance
                $balance += $transaction->amount;
            }
        }

        return $balance;
    }

    /**
     * Find upline rank for a user
     */
    private function findUplineRank($currentUserId, $packageAmount)
    {
        $user = User::find($currentUserId);
        if (!$user) {
            throw new \Exception("User not found");
        }

        // Initialize variables
        $badgeDirectReferral = $user->referred_by;
        $badgeThreeStarsUser = null;
        $badgeFiveStarsUser = null;
        $badgeSevenStarsUser = null;
        $badgeMegaStarsUser = null;
        $badgeGigaStarsUser = null;

        // Find Three Stars User
        $badgeThreeStarsUser = $this->findBadgeUser($badgeDirectReferral, 'three_stars');

        // Find Five Stars User
        $badgeFiveStarsUser = $this->findBadgeUser($badgeDirectReferral, 'five_stars');

        // Find Seven Stars User
        $badgeSevenStarsUser = $this->findBadgeUser($badgeDirectReferral, 'seven_stars');

        // Find Mega Stars User
        $badgeMegaStarsUser = $this->findBadgeUser($badgeDirectReferral, 'mega_stars');

        // Find Giga Stars User
        $badgeGigaStarsUser = $this->findBadgeUser($badgeDirectReferral, 'giga_stars');

        // Save to member_upline_rank table
        $memberUplineRank = MemberUplineRank::create([
            'user_id' => $currentUserId,
            'refferal_user_id' => $badgeDirectReferral,
            'three_star_user_id' => $badgeThreeStarsUser,
            'five_star_user_id' => $badgeFiveStarsUser,
            'seven_star_user_id' => $badgeSevenStarsUser,
            'mega_star_user_id' => $badgeMegaStarsUser,
            'giga_star_user_id' => $badgeGigaStarsUser,
        ]);

        // Create transaction record
        $today = now();
        Transaction::create([
            'transaction_nature' => 'Activation',
            'transaction_type' => 'Membership Activation',
            'debit_credit' => 1,
            'matching_date' => $today->toDateString(),
            'transaction_from_id' => $currentUserId,
            'transaction_to_id' => $currentUserId,
            'trigger_id' => $currentUserId,
            'created_user_id' => $currentUserId,
            'amount' => $packageAmount,
            'transaction_date' => $today,
            'status' => 1,
            'countStatus' => 1,
            'tax_status' => 0, // Not tax amount
        ]);

        // Create package amount refund transaction record
        Transaction::create([
            'transaction_nature' => 'Amount Refund',
            'transaction_type' => 'Package Amount Refunded',
            'debit_credit' => 2,
            'matching_date' => $today->toDateString(),
            'transaction_from_id' => $currentUserId,
            'transaction_to_id' => $currentUserId,
            'trigger_id' => $currentUserId,
            'created_user_id' => $currentUserId,
            'amount' => $packageAmount,
            'transaction_date' => $today,
            'status' => 1,
            'countStatus' => 0,
            'tax_status' => 0, // Not tax amount
        ]);

        // Note: rankFindStatus is updated in the main activateMemberPackage function

        return [
            'success' => true,
            'message' => 'Upline rank found and saved successfully',
            'data' => [
                'member_upline_rank_id' => $memberUplineRank->id,
                'badge_direct_referral' => $badgeDirectReferral,
                'badge_three_stars_user' => $badgeThreeStarsUser,
                'badge_five_stars_user' => $badgeFiveStarsUser,
                'badge_seven_stars_user' => $badgeSevenStarsUser,
                'badge_mega_stars_user' => $badgeMegaStarsUser,
                'badge_giga_stars_user' => $badgeGigaStarsUser,
            ]
        ];
    }

    /**
     * Find badge user by traversing upline
     */
    private function findBadgeUser($startUserId, $badgeType)
    {
        if (!$startUserId) {
            return null;
        }

        $currentUserId = $startUserId;
        $maxIterations = 100; // Prevent infinite loops
        $iteration = 0;

        while ($currentUserId && $iteration < $maxIterations) {
            $iteration++;

            // Check if current user has the badge
            $hasBadge = $this->checkUserHasBadge($currentUserId, $badgeType);
            
            if ($hasBadge) {
                return $currentUserId;
            }

            // Get the referred_by of current user
            $user = User::find($currentUserId);
            if (!$user || !$user->referred_by) {
                break;
            }

            $currentUserId = $user->referred_by;
        }

        return null;
    }

    /**
     * Check if user has specific badge
     */
    private function checkUserHasBadge($userId, $badgeType)
    {
        switch ($badgeType) {
            case 'three_stars':
                return BadgeThreeStars::where('user_id', $userId)->exists();
            case 'five_stars':
                return BadgeFiveStars::where('user_id', $userId)->exists();
            case 'seven_stars':
                return BadgeSevenStars::where('user_id', $userId)->exists();
            case 'mega_stars':
                return BadgeMegaStars::where('user_id', $userId)->exists();
            case 'giga_stars':
                return BadgeGigaStars::where('user_id', $userId)->exists();
            default:
                return false;
        }
    }

    /**
     * Member promotion function - Traverse upline hierarchy and process promotions
     */
    private function memberPromotion($userId)
    {
        $user = User::find($userId);
        if (!$user) {
            throw new \Exception("User not found");
        }

        $uplineTraversal = [];
        $currentUplineUserId = $user->referred_by;
        $maxIterations = 1000; // Prevent infinite loops
        $iteration = 0;

        // Start from the direct upline (referred_by)
        while ($currentUplineUserId && $currentUplineUserId != 1 && $iteration < $maxIterations) {
            $iteration++;
            
            // Get the current upline user
            $uplineUser = User::find($currentUplineUserId);
            if (!$uplineUser) {
                break;
            }
            
            // Check if upline user is paid and active (member_type = 'paid' AND activeStatus = 1)
            $isPaidAndActive = ($uplineUser->member_type === 'paid' && $uplineUser->activeStatus == 1);
            
            if ($isPaidAndActive) {
                // Process promotions for current upline user (only for paid and active members)
                $promotionResults = $this->processUserPromotions($currentUplineUserId);
                
                // Display current upline user ID with promotion results
                $uplineTraversal[] = [
                    'iteration' => $iteration,
                    'current_upline_user_id' => $currentUplineUserId,
                    'member_type' => $uplineUser->member_type,
                    'activeStatus' => $uplineUser->activeStatus,
                    'promotion_results' => $promotionResults
                ];
            } else {
                // Skip free or inactive members
                $uplineTraversal[] = [
                    'iteration' => $iteration,
                    'current_upline_user_id' => $currentUplineUserId,
                    'member_type' => $uplineUser->member_type,
                    'activeStatus' => $uplineUser->activeStatus,
                    'skipped' => true,
                    'reason' => 'User is not a paid and active member'
                ];
            }

            // Get the next upline user
            if (!$uplineUser->referred_by) {
                break;
            }

            // Move to next upline
            $currentUplineUserId = $uplineUser->referred_by;
        }

        // If we reached user ID 1, add it to the traversal
        if ($currentUplineUserId == 1) {
            $rootUser = User::find(1);
            $isPaidAndActive = ($rootUser && $rootUser->member_type === 'paid' && $rootUser->activeStatus == 1);
            
            if ($isPaidAndActive) {
                $promotionResults = $this->processUserPromotions(1);
                $uplineTraversal[] = [
                    'iteration' => $iteration + 1,
                    'current_upline_user_id' => 1,
                    'note' => 'Reached root user (ID = 1)',
                    'member_type' => $rootUser->member_type,
                    'activeStatus' => $rootUser->activeStatus,
                    'promotion_results' => $promotionResults
                ];
            } else {
                $uplineTraversal[] = [
                    'iteration' => $iteration + 1,
                    'current_upline_user_id' => 1,
                    'note' => 'Reached root user (ID = 1)',
                    'member_type' => $rootUser ? $rootUser->member_type : 'unknown',
                    'activeStatus' => $rootUser ? $rootUser->activeStatus : 0,
                    'skipped' => true,
                    'reason' => 'Root user is not a paid and active member'
                ];
            }
        }

        // Note: promotionRunStatus is updated in the main activateMemberPackage function

        return [
            'success' => true,
            'message' => 'Member promotion upline traversal completed',
            'user_id' => $userId,
            'total_iterations' => count($uplineTraversal),
            'upline_traversal' => $uplineTraversal,
            'reached_root' => $currentUplineUserId == 1
        ];
    }

    /**
     * Process promotions for a specific user
     */
    private function processUserPromotions($currentUplineUserId)
    {
        $results = [];

        // Three Star Promotion
        $threeStarResult = $this->processThreeStarPromotion($currentUplineUserId);
        $results['three_star'] = $threeStarResult;

        // Five Star Promotion
        $fiveStarResult = $this->processFiveStarPromotion($currentUplineUserId);
        $results['five_star'] = $fiveStarResult;

        // Seven Star Promotion
        $sevenStarResult = $this->processSevenStarPromotion($currentUplineUserId);
        $results['seven_star'] = $sevenStarResult;

        // Mega Star Promotion
        $megaStarResult = $this->processMegaStarPromotion($currentUplineUserId);
        $results['mega_star'] = $megaStarResult;

        // Giga Star Promotion
        $gigaStarResult = $this->processGigaStarPromotion($currentUplineUserId);
        $results['giga_star'] = $gigaStarResult;

        return $results;
    }

    /**
     * Process Three Star Promotion
     */
    private function processThreeStarPromotion($currentUplineUserId)
    {
        // Check eligibility: count users with referral_count = 0
        $findThreeStarEligible = User::where('referred_by', $currentUplineUserId)
            ->where('referral_count', 0)
            ->count();

        if ($findThreeStarEligible >= 2) {
            // Get only 2 eligible users (limit to 2) in ascending order by ID
            $eligibleUsers = User::where('referred_by', $currentUplineUserId)
                ->where('referral_count', 0)
                ->orderBy('id', 'asc')
                ->limit(2)
                ->pluck('id')
                ->toArray();

            // Insert into badge_three_stars table
            $badgeThreeStars = BadgeThreeStars::create([
                'user_id' => $currentUplineUserId,
                'countStatus' => 0,
                'refer_users' => json_encode($eligibleUsers)
            ]);

            // Update referral_count to 1 for only 2 eligible users in ascending order by ID
            User::where('referred_by', $currentUplineUserId)
                ->where('referral_count', 0)
                ->orderBy('id', 'asc')
                ->limit(2)
                ->update(['referral_count' => 1]);

            return [
                'eligible' => true,
                'count' => $findThreeStarEligible,
                'badge_id' => $badgeThreeStars->id,
                'refer_users' => $eligibleUsers,
                'message' => 'Three Star badge created successfully'
            ];
        }

        return [
            'eligible' => false,
            'count' => $findThreeStarEligible,
            'required' => 2,
            'message' => 'Not eligible for Three Star promotion'
        ];
    }

    /**
     * Process Five Star Promotion
     */
    private function processFiveStarPromotion($currentUplineUserId)
    {
        // Check eligibility: count from badge_three_stars where countStatus = 0
        $findFiveStarEligible = BadgeThreeStars::where('user_id', $currentUplineUserId)
            ->where('countStatus', 0)
            ->count();

        if ($findFiveStarEligible >= 5) {
            // Get only 5 eligible three star badges in ascending order by ID
            $eligibleThreeStars = BadgeThreeStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(5)
                ->pluck('id')
                ->toArray();

            // Insert into badge_five_stars table
            $badgeFiveStars = BadgeFiveStars::create([
                'user_id' => $currentUplineUserId,
                'countStatus' => 0,
                'refer_three_stars' => json_encode($eligibleThreeStars)
            ]);

            // Update countStatus to 1 for only 5 eligible three star badges in ascending order by ID
            BadgeThreeStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(5)
                ->update(['countStatus' => 1]);

            return [
                'eligible' => true,
                'count' => $findFiveStarEligible,
                'badge_id' => $badgeFiveStars->id,
                'refer_three_stars' => $eligibleThreeStars,
                'message' => 'Five Star badge created successfully'
            ];
        }

        return [
            'eligible' => false,
            'count' => $findFiveStarEligible,
            'required' => 5,
            'message' => 'Not eligible for Five Star promotion'
        ];
    }

    /**
     * Process Seven Star Promotion
     */
    private function processSevenStarPromotion($currentUplineUserId)
    {
        // Check eligibility: count from badge_five_stars where countStatus = 0
        $findSevenStarEligible = BadgeFiveStars::where('user_id', $currentUplineUserId)
            ->where('countStatus', 0)
            ->count();

        if ($findSevenStarEligible >= 7) {
            // Get only 7 eligible five star badges in ascending order by ID
            $eligibleFiveStars = BadgeFiveStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(7)
                ->pluck('id')
                ->toArray();

            // Insert into badge_seven_stars table
            $badgeSevenStars = BadgeSevenStars::create([
                'user_id' => $currentUplineUserId,
                'countStatus' => 0,
                'refer_five_stars' => json_encode($eligibleFiveStars)
            ]);

            // Update countStatus to 1 for only 7 eligible five star badges in ascending order by ID
            BadgeFiveStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(7)
                ->update(['countStatus' => 1]);

            return [
                'eligible' => true,
                'count' => $findSevenStarEligible,
                'badge_id' => $badgeSevenStars->id,
                'refer_five_stars' => $eligibleFiveStars,
                'message' => 'Seven Star badge created successfully'
            ];
        }

        return [
            'eligible' => false,
            'count' => $findSevenStarEligible,
            'required' => 7,
            'message' => 'Not eligible for Seven Star promotion'
        ];
    }

    /**
     * Process Mega Star Promotion
     */
    private function processMegaStarPromotion($currentUplineUserId)
    {
        // Check eligibility: count from badge_seven_stars where countStatus = 0
        $findMegaStarEligible = BadgeSevenStars::where('user_id', $currentUplineUserId)
            ->where('countStatus', 0)
            ->count();

        if ($findMegaStarEligible >= 10) {
            // Get only 10 eligible seven star badges in ascending order by ID
            $eligibleSevenStars = BadgeSevenStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(10)
                ->pluck('id')
                ->toArray();

            // Insert into badge_mega_stars table
            $badgeMegaStars = BadgeMegaStars::create([
                'user_id' => $currentUplineUserId,
                'countStatus' => 0,
                'refer_seven_stars' => json_encode($eligibleSevenStars)
            ]);

            // Update countStatus to 1 for only 10 eligible seven star badges in ascending order by ID
            BadgeSevenStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(10)
                ->update(['countStatus' => 1]);

            return [
                'eligible' => true,
                'count' => $findMegaStarEligible,
                'badge_id' => $badgeMegaStars->id,
                'refer_seven_stars' => $eligibleSevenStars,
                'message' => 'Mega Star badge created successfully'
            ];
        }

        return [
            'eligible' => false,
            'count' => $findMegaStarEligible,
            'required' => 10,
            'message' => 'Not eligible for Mega Star promotion'
        ];
    }

    /**
     * Process Giga Star Promotion
     */
    private function processGigaStarPromotion($currentUplineUserId)
    {
        // Check eligibility: count from badge_mega_stars where countStatus = 0
        $findGigaStarEligible = BadgeMegaStars::where('user_id', $currentUplineUserId)
            ->where('countStatus', 0)
            ->count();

        if ($findGigaStarEligible >= 10) {
            // Get only 10 eligible mega star badges in ascending order by ID
            $eligibleMegaStars = BadgeMegaStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(10)
                ->pluck('id')
                ->toArray();

            // Insert into badge_giga_stars table
            $badgeGigaStars = BadgeGigaStars::create([
                'user_id' => $currentUplineUserId,
                'countStatus' => 0,
                'refer_mega_stars' => json_encode($eligibleMegaStars)
            ]);

            // Update countStatus to 1 for only 10 eligible mega star badges in ascending order by ID
            BadgeMegaStars::where('user_id', $currentUplineUserId)
                ->where('countStatus', 0)
                ->orderBy('id', 'asc')
                ->limit(10)
                ->update(['countStatus' => 1]);

            return [
                'eligible' => true,
                'count' => $findGigaStarEligible,
                'badge_id' => $badgeGigaStars->id,
                'refer_mega_stars' => $eligibleMegaStars,
                'message' => 'Giga Star badge created successfully'
            ];
        }

        return [
            'eligible' => false,
            'count' => $findGigaStarEligible,
            'required' => 10,
            'message' => 'Not eligible for Giga Star promotion'
        ];
    }

    /**
     * Check what badges exist in the system
     */
    public function checkBadges()
    {
        try {
            $badges = [
                'three_stars' => BadgeThreeStars::count(),
                'five_stars' => BadgeFiveStars::count(),
                'seven_stars' => BadgeSevenStars::count(),
                'mega_stars' => BadgeMegaStars::count(),
                'giga_stars' => BadgeGigaStars::count(),
            ];

            $badgeUsers = [
                'three_stars_users' => BadgeThreeStars::pluck('user_id')->toArray(),
                'five_stars_users' => BadgeFiveStars::pluck('user_id')->toArray(),
                'seven_stars_users' => BadgeSevenStars::pluck('user_id')->toArray(),
                'mega_stars_users' => BadgeMegaStars::pluck('user_id')->toArray(),
                'giga_stars_users' => BadgeGigaStars::pluck('user_id')->toArray(),
            ];

            return response()->json([
                'success' => true,
                'badge_counts' => $badges,
                'badge_users' => $badgeUsers
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}