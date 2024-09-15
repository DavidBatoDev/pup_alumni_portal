<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;
use App\Models\Address;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AlumniController extends Controller
{
    // Method to register a new alumni with address and profile picture
    public function register(Request $request)
    {
        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:alumni',
            'phone' => 'required|string|max:15',
            'date_of_birth' => 'required|date',
            'gender' => 'required|string|max:10',
            'graduation_year' => 'required|integer',
            'degree' => 'required|string|max:255',
            'major' => 'required|string|max:255',
            'current_job_title' => 'nullable|string|max:255',
            'current_employer' => 'nullable|string|max:255',
            'linkedin_profile' => 'nullable|string|url',
            'profile_picture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Handle file upload
        if ($request->hasFile('profile_picture')) {
            $profilePicturePath = $request->file('profile_picture')->store('profile_pictures', 'public');
        }

        // Create new alumni record
        $alumni = Alumni::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'graduation_year' => $request->graduation_year,
            'degree' => $request->degree,
            'major' => $request->major,
            'current_job_title' => $request->current_job_title,
            'current_employer' => $request->current_employer,
            'linkedin_profile' => $request->linkedin_profile,
            'profile_picture' => isset($profilePicturePath) ? $profilePicturePath : null,
        ]);

        // Create the corresponding address record
        Address::create([
            'alumni_id' => $alumni->alumni_id,
            'street' => $request->street,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
        ]);

        // Generate JWT token for the alumni
        $token = JWTAuth::fromUser($alumni);

        return response()->json([
            'message' => 'Alumni successfully registered',
            'alumni' => $alumni,
            'token' => $token
        ], 201);
    }
}
