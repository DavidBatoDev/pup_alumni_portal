<?php
// app/Http/Controllers/AlumniController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use App\Models\Address;
use App\Models\EmploymentHistory;
use App\Models\EducationHistory;
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

        // Load address, employment, and education relationships
        $alumni->load(['address', 'employmentHistory', 'educationHistory']);

        // add url to profile picture
        if ($alumni->profile_picture) {
            $alumni->profile_picture = url('storage/' . $alumni->profile_picture);
        }

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
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'password' => 'nullable|string|min:8|confirmed',
        ]);


        if ($request->hasFile('profile_picture')) {
            $path = $request->file('profile_picture')->store('profile_pictures', 'public'); // Store in public disk
            $alumni->profile_picture = $path; // Save the path to the database
        }
    
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
            'current_employer', 'linkedin_profile'
        ]));
    
        // Check if password needs to be updated
        if ($request->filled('password')) {
            $alumni->update([
                'password' => Hash::make($request->password)
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $alumni
        ], 200);
    }


    /**
     * Add a new address for the authenticated alumni.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addAddress(Request $request)
    {
        // Validate the input
        $validator = Validator::make($request->all(), [
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // Create a new address for the authenticated alumni
        $address = Auth::user()->address()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'data' => $address
        ], 201);
    }

    /**
     * Update an existing address for the authenticated alumni.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAddress(Request $request, $id)
    {
        $address = Address::where('alumni_id', Auth::id())->findOrFail($id);

        // Validate the input
        $validator = Validator::make($request->all(), [
            'street' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'state' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // Update the address
        $address->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ], 200);
    }

    /**
     * Add employment history for the authenticated alumni.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addEmploymentHistory(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'company' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        // Create employment history for the authenticated alumni
        $employmentHistory = Auth::user()->employmentHistory()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Employment history added successfully',
            'data' => $employmentHistory,
        ], 201);
    }

    /**
     * Update an existing employment history.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEmploymentHistory(Request $request, $id)
    {
        $employmentHistory = EmploymentHistory::where('alumni_id', Auth::id())->findOrFail($id);

        // Validate input
        $validator = Validator::make($request->all(), [
            'company' => 'sometimes|string|max:255',
            'job_title' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        // Update employment history
        $employmentHistory->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Employment history updated successfully',
            'data' => $employmentHistory,
        ], 200);
    }

    /**
     * Add education history for the authenticated alumni.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addEducationHistory(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        // Create education history for the authenticated alumni
        $educationHistory = Auth::user()->educationHistory()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Education history added successfully',
            'data' => $educationHistory,
        ], 201);
    }

    /**
     * Update an existing education history.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEducationHistory(Request $request, $id)
    {
        $educationHistory = EducationHistory::where('alumni_id', Auth::id())->findOrFail($id);

        // Validate input
        $validator = Validator::make($request->all(), [
            'institution' => 'sometimes|string|max:255',
            'degree' => 'sometimes|string|max:255',
            'field_of_study' => 'sometimes|string|max:255',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        // Update education history
        $educationHistory->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Education history updated successfully',
            'data' => $educationHistory,
        ], 200);
    }
}
