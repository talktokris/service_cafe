<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockItemSetting;
use App\Models\OfficeProfile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class StockItemSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stockItemSettings = StockItemSetting::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'stockItemSettings' => $stockItemSettings
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
            'itemName' => 'required|string|max:255',
            'itemType' => 'required|in:food,drink',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $stockItemSetting = StockItemSetting::create($request->all());

        return back()->with([
            'success' => 'Stock item setting created successfully!',
            'stockItemSetting' => $stockItemSetting
        ])->withInput();
    }

    /**
     * Display the specified resource.
     */
    public function show(StockItemSetting $stockItemSetting)
    {
        return response()->json([
            'stockItemSetting' => $stockItemSetting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockItemSetting $stockItemSetting)
    {
        $validator = Validator::make($request->all(), [
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'itemName' => 'required|string|max:255',
            'itemType' => 'required|in:food,drink',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $stockItemSetting->update($request->all());

        return back()->with([
            'success' => 'Stock item setting updated successfully!',
            'stockItemSetting' => $stockItemSetting
        ])->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockItemSetting $stockItemSetting)
    {
        // Soft delete by setting deleteStatus to 1
        $stockItemSetting->update(['deleteStatus' => 1]);

        return back()->with([
            'success' => 'Stock item setting deleted successfully!'
        ])->withInput();
    }

    /**
     * Get stock item settings for the manage stock item settings page
     */
    public function getStockItemSettings()
    {
        $stockItemSettings = StockItemSetting::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($stockItemSettings);
    }
}