<?php
// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Alumni;
use App\Models\Address; // Import the Address model
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Register a new alumni
    public function register(Request $request)
    {
        Log::info('Register method hit.');
        Log::info('Request data:', $request->all());

        try {
            // Validate the request
            $request->validate([
                // Alumni fields
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:alumni',
                'password' => 'required|string|min:6|confirmed',
                'graduation_year' => 'required|integer',
                'degree' => 'required|string|max:255',
                'major' => 'required|string|max:255',
                
                // Address fields
                'street' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'postal_code' => 'required|string|max:20',
                'country' => 'required|string|max:100',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log validation errors and return a response
            Log::error('Validation failed:', $e->errors());
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        }

        // Create the alumni record with required fields
        $alumni = Alumni::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'date_of_birth' => $request->date_of_birth,
            'gender' => $request->gender,
            'graduation_year' => $request->graduation_year,
            'degree' => $request->degree,
            'major' => $request->major,
            'current_job_title' => $request->current_job_title,
            'current_employer' => $request->current_employer,
            'linkedin_profile' => $request->linkedin_profile,
            'profile_picture' => 'default-profile.png', // Default profile picture
        ]);

        // Create the corresponding address record
        Address::create([
            'alumni_id' => $alumni->alumni_id, // Reference to the newly created alumni
            'street' => $request->street,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
        ]);

        // Generate JWT token for the newly created alumni
        $token = JWTAuth::fromUser($alumni);

        return response()->json([
            'message' => 'Alumni successfully registered',
            'alumni' => $alumni,
            'token' => $token
        ], 201);
    }

    // Login the alumni
    public function login(Request $request)
    {
        // Validate the input data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ], [
            'email.required' => 'The email field is required.',
            'email.email' => 'The email must be a valid email address.',
            'password.required' => 'The password field is required.',
            'password.min' => 'The password must be at least 6 characters long.'
        ]);
    
        // If validation fails, return the validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422); 
        }
    
        // Retrieve the credentials from the request
        $credentials = $request->only('email', 'password');
    
        // Attempt to authenticate using JWT
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Wrong email or password',
            ], 401);
        }
    
        $user = auth()->user();
    
        // If authentication passes, return the token and user data
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    // Logout the alumni (invalidate the token)
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }
}
