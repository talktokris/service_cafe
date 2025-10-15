<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\OfficeProfile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menuItems = MenuItem::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'menuItems' => $menuItems
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
            'menuName' => 'required|string|max:255',
            'menuType' => 'required|in:food,drink',
            'drinkAmount' => 'nullable|numeric|min:0',
            'buyingPrice' => 'required|numeric|min:0',
            'adminProfitPercentage' => 'nullable|numeric|min:0',
            'adminProfitAmount' => 'nullable|numeric|min:0',
            'userCommissionPercentage' => 'nullable|numeric|min:0',
            'userCommissionAmount' => 'nullable|numeric|min:0',
            'govTaxPercentage' => 'nullable|numeric|min:0',
            'govTaxAmount' => 'nullable|numeric|min:0',
            'sellingWithTaxPrice' => 'nullable|numeric|min:0',
            'sellingPrice' => 'required|numeric|min:0',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Add the logged-in user's ID to the request data
        $data = $request->all();
        $data['createUserId'] = Auth::id();

        $menuItem = MenuItem::create($data);

        return back()->with([
            'success' => 'Menu item created successfully!',
            'menuItem' => $menuItem
        ])->withInput();
    }

    /**
     * Display the specified resource.
     */
    public function show(MenuItem $menuItem)
    {
        return response()->json([
            'menuItem' => $menuItem
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MenuItem $menuItem)
    {
        $validator = Validator::make($request->all(), [
            'headOfficeId' => 'required|exists:office_profiles,id',
            'branchId' => 'nullable|exists:office_profiles,id',
            'menuName' => 'required|string|max:255',
            'menuType' => 'required|in:food,drink',
            'drinkAmount' => 'nullable|numeric|min:0',
            'buyingPrice' => 'required|numeric|min:0',
            'adminProfitPercentage' => 'nullable|numeric|min:0',
            'adminProfitAmount' => 'nullable|numeric|min:0',
            'userCommissionPercentage' => 'nullable|numeric|min:0',
            'userCommissionAmount' => 'nullable|numeric|min:0',
            'govTaxPercentage' => 'nullable|numeric|min:0',
            'govTaxAmount' => 'nullable|numeric|min:0',
            'sellingWithTaxPrice' => 'nullable|numeric|min:0',
            'sellingPrice' => 'required|numeric|min:0',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $menuItem->update($request->all());

        return back()->with([
            'success' => 'Menu item updated successfully!',
            'menuItem' => $menuItem
        ])->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MenuItem $menuItem)
    {
        // Soft delete by setting deleteStatus to 1
        $menuItem->update(['deleteStatus' => 1]);

        return back()->with([
            'success' => 'Menu item deleted successfully!'
        ])->withInput();
    }

    /**
     * Get menu items for the manage menu items page
     */
    public function getMenuItems()
    {
        $menuItems = MenuItem::where('deleteStatus', 0)
            ->with(['headOffice', 'branch'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($menuItems);
    }
}