<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockRecord;
use App\Models\OfficeProfile;
use App\Models\StockItemSetting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class StockRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stockRecords = StockRecord::where('deleteStatus', 0)
            ->with(['headOffice', 'branch', 'stockItemSetting'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'stockRecords' => $stockRecords
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
            'stockItemSettingId' => 'nullable|exists:stock_item_settings,id',
            'itemType' => 'required|in:food,drink',
            'itemAmount' => 'required|numeric|min:0',
            'itemMassWeightKG' => 'nullable|integer|min:0',
            'itemLiquidWeightML' => 'nullable|integer|min:0',
            'quantity' => 'required|integer|min:0',
            'itemAmountTotal' => 'nullable|numeric|min:0',
            'itemMassWeightKGTotal' => 'nullable|integer|min:0',
            'itemLiquidWeightMLTotal' => 'nullable|integer|min:0',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Add the logged-in user's ID to the request data
        $data = $request->all();
        $data['createUserId'] = Auth::id();

        // Debug logging
        Log::info('Creating stock record with data:', $data);
        Log::info('itemAmount:', ['value' => $data['itemAmount'] ?? 'not set']);
        Log::info('quantity:', ['value' => $data['quantity'] ?? 'not set']);
        Log::info('itemAmountTotal:', ['value' => $data['itemAmountTotal'] ?? 'not set']);

        $stockRecord = StockRecord::create($data);
        
        // Load the created record with relationships
        $stockRecord = StockRecord::with(['headOffice', 'branch', 'stockItemSetting'])
            ->find($stockRecord->id);

        // Debug logging for created record
        Log::info('Created stock record:', $stockRecord->toArray());
        Log::info('Created record itemAmountTotal:', ['value' => $stockRecord->itemAmountTotal]);

        return back()->with([
            'success' => 'Stock record created successfully!',
            'stockRecord' => $stockRecord
        ])->withInput();
    }

    /**
     * Display the specified resource.
     */
    public function show(StockRecord $stockRecord)
    {
        return response()->json([
            'stockRecord' => $stockRecord
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockRecord $stockRecord)
    {
        $validator = Validator::make($request->all(), [
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'stockItemSettingId' => 'nullable|exists:stock_item_settings,id',
            'itemType' => 'required|in:food,drink',
            'itemAmount' => 'required|numeric|min:0',
            'itemMassWeightKG' => 'nullable|integer|min:0',
            'itemLiquidWeightML' => 'nullable|integer|min:0',
            'quantity' => 'required|integer|min:0',
            'itemAmountTotal' => 'nullable|numeric|min:0',
            'itemMassWeightKGTotal' => 'nullable|integer|min:0',
            'itemLiquidWeightMLTotal' => 'nullable|integer|min:0',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $stockRecord->update($request->all());
        
        // Reload the updated record with relationships
        $stockRecord = StockRecord::with(['headOffice', 'branch', 'stockItemSetting'])
            ->find($stockRecord->id);

        return back()->with([
            'success' => 'Stock record updated successfully!',
            'stockRecord' => $stockRecord
        ])->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockRecord $stockRecord)
    {
        // Soft delete by setting deleteStatus to 1
        $stockRecord->update(['deleteStatus' => 1]);

        return back()->with([
            'success' => 'Stock record deleted successfully!'
        ])->withInput();
    }

    /**
     * Get stock records for the manage stock records page
     */
    public function getStockRecords()
    {
        $stockRecords = StockRecord::where('deleteStatus', 0)
            ->with(['headOffice', 'branch', 'stockItemSetting'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($stockRecords);
    }
}