<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OfficeProfile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class OfficeProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $officeProfiles = OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'officeProfiles' => $officeProfiles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'companyName' => 'required|string|max:255',
            'profileType' => 'required|in:HeadOffice,BranchOffice',
            'regNo' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phoneNo' => 'nullable|string|max:20',
            'contactFirstName' => 'required|string|max:255',
            'contactLastName' => 'required|string|max:255',
            'contactEmail' => 'nullable|email|max:255',
            'contactMobileNo' => 'nullable|string|max:20',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $officeProfile = OfficeProfile::create($request->all());

        return back()->with([
            'success' => 'Office profile created successfully!',
            'officeProfile' => $officeProfile
        ])->withInput();
    }

    /**
     * Display the specified resource.
     */
    public function show(OfficeProfile $officeProfile)
    {
        return response()->json([
            'officeProfile' => $officeProfile
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, OfficeProfile $officeProfile)
    {
        $validator = Validator::make($request->all(), [
            'companyName' => 'required|string|max:255',
            'profileType' => 'required|in:HeadOffice,BranchOffice',
            'regNo' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phoneNo' => 'nullable|string|max:20',
            'contactFirstName' => 'required|string|max:255',
            'contactLastName' => 'required|string|max:255',
            'contactEmail' => 'nullable|email|max:255',
            'contactMobileNo' => 'nullable|string|max:20',
            'activeStatus' => 'required|integer|in:0,1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $officeProfile->update($request->all());

        return back()->with([
            'success' => 'Office profile updated successfully!',
            'officeProfile' => $officeProfile
        ])->withInput();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OfficeProfile $officeProfile)
    {
        // Soft delete by setting deleteStatus to 1
        $officeProfile->update(['deleteStatus' => 1]);

        return back()->with([
            'success' => 'Office profile deleted successfully!'
        ])->withInput();
    }

    /**
     * Get office profiles for the branch management page
     */
    public function getOfficeProfiles()
    {
        $officeProfiles = OfficeProfile::where('deleteStatus', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($officeProfiles);
    }
}
