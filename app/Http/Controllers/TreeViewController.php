<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TreeViewController extends Controller
{
    /**
     * Display the tree view for members
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('error', 'Please log in to access the tree view.');
        }

        if ($user->user_type !== 'member') {
            return redirect()->route('login')->with('error', 'Access denied. This page is for members only.');
        }

        // For now, we'll use dummy data. Later this can be replaced with real referral data
        $treeData = [
            'name' => 'Francisco Haas',
            'role' => 'Job Role Here',
            'level' => 1,
            'children' => [
                [
                    'name' => 'Emmitt Wilkinson',
                    'role' => 'Job Role Here',
                    'level' => 2,
                    'children' => [
                        [
                            'name' => 'Erick Clay',
                            'role' => 'Job Role Here',
                            'level' => 3,
                            'children' => [
                                ['name' => 'Willie Page', 'role' => 'Job Role Here', 'level' => 4, 'children' => []],
                                ['name' => 'Bud Bowen', 'role' => 'Job Role Here', 'level' => 4, 'children' => []]
                            ]
                        ],
                        [
                            'name' => 'Duncan Carrol',
                            'role' => 'Job Role Here',
                            'level' => 3,
                            'children' => [
                                ['name' => 'Gabrielle Holden', 'role' => 'Job Role Here', 'level' => 4, 'children' => []],
                                ['name' => 'Elena Stafford', 'role' => 'Job Role Here', 'level' => 4, 'children' => []]
                            ]
                        ]
                    ]
                ],
                [
                    'name' => 'Truman Freeman',
                    'role' => 'Job Role Here',
                    'level' => 2,
                    'children' => [
                        [
                            'name' => 'Lamont Cummings',
                            'role' => 'Job Role Here',
                            'level' => 3,
                            'children' => [
                                ['name' => 'Kory Keller', 'role' => 'Job Role Here', 'level' => 4, 'children' => []],
                                ['name' => 'Vicky Pham', 'role' => 'Job Role Here', 'level' => 4, 'children' => []]
                            ]
                        ],
                        [
                            'name' => 'Andre Scott',
                            'role' => 'Job Role Here',
                            'level' => 3,
                            'children' => [
                                ['name' => 'Noah Schmitt', 'role' => 'Job Role Here', 'level' => 4, 'children' => []],
                                ['name' => 'Nick Hobbs', 'role' => 'Job Role Here', 'level' => 4, 'children' => []]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return Inertia::render('Members/' . ($user->member_type === 'free' ? 'FreeMember' : 'PaidMember') . '/TreeViewMember', [
            'auth' => ['user' => $user],
            'memberType' => $user->member_type,
            'treeData' => $treeData
        ]);
    }
}
