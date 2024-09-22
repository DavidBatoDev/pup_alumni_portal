<?php
// app/Http/Controllers/AlumniController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AlumniController extends Controller
{
    /**
     * Get the authenticated alumni profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        // Get authenticated alumni
        $alumni = Auth::user();

        // Load address relationship if needed
        $alumni->load('address');

        return response()->json([
            'success' => true,
            'data' => $alumni
        ], 200);
    }

    /**
     * Update the authenticated alumni profile.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        // Get the authenticated alumni
        $alumni = Auth::user();
    
        // Validate the request with optional fields
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:alumni,email,' . $alumni->id . ',alumni_id',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'graduation_year' => 'nullable|integer',
            'degree' => 'nullable|string|max:255',
            'major' => 'nullable|string|max:255',
            'current_job_title' => 'nullable|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'linkedin_profile' => 'nullable|url|max:255',
            'profile_picture' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:8|confirmed',
        ]);
    
        // If validation fails, return errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }
    
        // Update only the fields that are provided
        $alumni->update($request->only([
            'first_name', 'last_name', 'email', 'phone', 'date_of_birth', 
            'gender', 'graduation_year', 'degree', 'major', 'current_job_title', 
            'current_employer', 'linkedin_profile', 'profile_picture'
        ]));
    
        // Check if password needs to be updated
        if ($request->filled('password')) {
            $alumni->update([
                'password' => Hash::make($request->password)
            ]);
        }
    
        // Update address if provided
        if ($request->filled(['street', 'city', 'state', 'postal_code', 'country'])) {
            $alumni->address()->updateOrCreate(
                ['alumni_id' => $alumni->id],
                [
                    'street' => $request->street,
                    'city' => $request->city,
                    'state' => $request->state,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country
                ]
            );
        }
    
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $alumni->load('address')
        ], 200);
    }
}
