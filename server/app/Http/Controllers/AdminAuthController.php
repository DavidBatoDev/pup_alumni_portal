<?php
// server/app/Http/Controllers/AdminAuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;

class AdminAuthController extends Controller
{
    // Register a new admin
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admin',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Create new admin
        $admin = Admin::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'admin',
        ]);

        // Generate JWT token for the admin
        $token = JWTAuth::fromUser($admin);

        return response()->json([
            'message' => 'Admin successfully registered',
            'admin' => $admin,
            'token' => $token
        ], 201);
    }

    // Login the admin
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
    
            // Attempt to authenticate using the 'admin' guard
            if (!$token = auth('admin')->attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
    
            // Get the authenticated admin's email
            $adminEmail = auth('admin')->user()->email;
    
            // Include the email in the response along with the token
            return response()->json([
                'token' => $token,
                'email' => $adminEmail,
            ], 200);
        } catch (\Exception $e) {
            // Log the exception for debugging purposes
            \Log::error('Login error: '.$e->getMessage());
    
            // Return a generic error message
            return response()->json(['error' => 'An error occurred while trying to log in. Please try again later.'], 500);
        }
    }
    

    // Logout the admin
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Successfully logged out']);
    }
}
