<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RestaurantTable;
use App\Models\OfficeProfile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class RestaurantTableController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $restaurantTables = RestaurantTable::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'restaurantTables' => $restaurantTables
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'tableShortName' => 'required|string|max:20',
            'tableShortFullName' => 'required|string|max:150',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $restaurantTable = RestaurantTable::create($request->all());

        return back()->with([
            'success' => 'Restaurant table created successfully!',
            'restaurantTable' => $restaurantTable
        ])->withInput();
    }

    /**
     * Display the specified resource.
     */
    public function show(RestaurantTable $restaurantTable)
    {
        return response()->json([
            'restaurantTable' => $restaurantTable
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RestaurantTable $restaurantTable)
    {
        $validator = Validator::make($request->all(), [
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'tableShortName' => 'required|string|max:20',
            'tableShortFullName' => 'required|string|max:150',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $restaurantTable->update($request->all());

        return back()->with([
            'success' => 'Restaurant table updated successfully!',
            'restaurantTable' => $restaurantTable
        ])->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RestaurantTable $restaurantTable)
    {
        // Soft delete by setting deleteStatus to 1
        $restaurantTable->update(['deleteStatus' => 1]);

        return back()->with([
            'success' => 'Restaurant table deleted successfully!'
        ])->withInput();
    }

    /**
     * Get restaurant tables for the manage tables page
     */
    public function getRestaurantTables()
    {
        $restaurantTables = RestaurantTable::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($restaurantTables);
    }
}