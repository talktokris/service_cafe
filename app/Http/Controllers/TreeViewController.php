<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;

class TreeViewController extends Controller
{
    /**
     * Display the tree view for members
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access the tree view.');
        }

        if ($user->user_type !== 'member') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for members only.');
        }

        // Get the starting user ID (from query param or default to logged-in user)
        $startUserId = $request->input('start_user_id', $user->id);
        
        // Ensure user can't view tree above their own level (security check)
        if (!$this->canViewUser($user->id, $startUserId)) {
            $startUserId = $user->id;
        }

        // Build tree data starting from specified user (5 levels deep)
        $treeData = $this->buildReferralTree($startUserId, 1, 5);
        
        // Get parent information for upward navigation
        $startUser = User::find($startUserId);
        $parentInfo = null;
        if ($startUser && $startUser->referred_by && $startUser->referred_by != $user->id) {
            $parentUser = User::find($startUser->referred_by);
            if ($parentUser && $this->canViewUser($user->id, $parentUser->id)) {
                $parentInfo = [
                    'id' => $parentUser->id,
                    'name' => $parentUser->name,
                    'can_navigate_up' => true
                ];
            }
        }

        return Inertia::render('Members/' . ($user->member_type === 'free' ? 'FreeMember' : 'PaidMember') . '/TreeViewMember', [
            'auth' => ['user' => $user],
            'memberType' => $user->member_type,
            'treeData' => $treeData,
            'currentRootUserId' => (int)$startUserId,
            'parentInfo' => $parentInfo,
            'loggedInUserId' => $user->id
        ]);
    }
    
    /**
     * Check if user can view another user's tree (must be in their downline or themselves)
     */
    private function canViewUser($loggedInUserId, $targetUserId)
    {
        if ($loggedInUserId == $targetUserId) {
            return true;
        }
        
        // Check if target user is in the downline of logged-in user
        return $this->isInDownline($loggedInUserId, $targetUserId);
    }
    
    /**
     * Check if target user is in the downline of source user
     */
    private function isInDownline($sourceUserId, $targetUserId, $maxDepth = 100)
    {
        $currentUserId = $targetUserId;
        $depth = 0;
        
        while ($currentUserId && $depth < $maxDepth) {
            $user = User::find($currentUserId);
            if (!$user || !$user->referred_by) {
                return false;
            }
            
            if ($user->referred_by == $sourceUserId) {
                return true;
            }
            
            $currentUserId = $user->referred_by;
            $depth++;
        }
        
        return false;
    }

    /**
     * Build referral tree recursively up to specified levels
     */
    private function buildReferralTree($userId, $currentLevel, $maxLevels)
    {
        $user = User::find($userId);

        if (!$user) {
            return null;
        }

        // Get highest badge for this user
        $highestBadge = $this->getHighestBadge($user);

        $treeNode = [
            'id' => $user->id,
            'name' => $user->name ?? 'Unknown',
            'email' => $user->email ?? '',
            'phone' => $user->phone ?? '',
            'member_type' => $user->member_type ?? 'free',
            'activeStatus' => $user->activeStatus ?? 0,
            'referral_code' => $user->referral_code ?? '',
            'level' => $currentLevel,
            'highestBadge' => $highestBadge,
            'children' => [],
            'hasMoreLevels' => false
        ];

        // If we haven't reached max levels, fetch children
        if ($currentLevel < $maxLevels) {
            $children = User::where('referred_by', $userId)
                ->orderBy('id', 'asc')
                ->get();

            foreach ($children as $child) {
                $childNode = $this->buildReferralTree($child->id, $currentLevel + 1, $maxLevels);
                if ($childNode) {
                    $treeNode['children'][] = $childNode;
                }
            }
        } else {
            // Check if there are more levels beyond max
            $hasChildren = User::where('referred_by', $userId)->exists();
            $treeNode['hasMoreLevels'] = $hasChildren;
        }

        return $treeNode;
    }

    /**
     * Get highest badge for a user (check from highest to lowest)
     */
    private function getHighestBadge($user)
    {
        // Check from highest to lowest
        if (\App\Models\BadgeGigaStars::where('user_id', $user->id)->exists()) {
            return [
                'name' => 'Mount Everest',
                'initial' => 'E',
                'color' => 'from-indigo-500 to-indigo-700',
                'rank' => 6
            ];
        }
        
        if (\App\Models\BadgeMegaStars::where('user_id', $user->id)->exists()) {
            return [
                'name' => 'Kanchenjunga',
                'initial' => 'K',
                'color' => 'from-red-500 to-red-700',
                'rank' => 5
            ];
        }
        
        if (\App\Models\BadgeSevenStars::where('user_id', $user->id)->exists()) {
            return [
                'name' => 'Makalu',
                'initial' => 'M',
                'color' => 'from-purple-500 to-purple-700',
                'rank' => 4
            ];
        }
        
        if (\App\Models\BadgeFiveStars::where('user_id', $user->id)->exists()) {
            return [
                'name' => 'Dhaulagiri',
                'initial' => 'D',
                'color' => 'from-yellow-500 to-yellow-700',
                'rank' => 3
            ];
        }
        
        if (\App\Models\BadgeThreeStars::where('user_id', $user->id)->exists()) {
            return [
                'name' => 'Manaslu',
                'initial' => 'M',
                'color' => 'from-green-500 to-green-700',
                'rank' => 2
            ];
        }
        
        // Check if active paid member (Annapurna)
        if ($user->member_type === 'paid' && $user->activeStatus == 1) {
            return [
                'name' => 'Annapurna',
                'initial' => 'A',
                'color' => 'from-blue-500 to-blue-700',
                'rank' => 1
            ];
        }
        
        return null;
    }

    /**
     * Fetch children for a specific user (API endpoint for dynamic loading)
     */
    public function getChildren(Request $request)
    {
        $userId = $request->input('user_id');
        $currentLevel = $request->input('current_level', 1);
        $maxLevels = 5; // Load 5 more levels from this point

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User ID is required'
            ], 400);
        }

        $treeData = $this->buildReferralTree($userId, $currentLevel, $currentLevel + $maxLevels - 1);

        return response()->json([
            'success' => true,
            'data' => $treeData
        ]);
    }
}
