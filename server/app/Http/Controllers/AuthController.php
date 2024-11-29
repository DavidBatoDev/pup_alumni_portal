<?php
// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\Alumni;
use App\Models\Address;
use App\Models\Graduate;
use App\Notifications\CustomResetPasswordEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Password as PasswordFacade;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
// Carbon for date/time functions
use Carbon\Carbon;
use Illuminate\Support\Str;



class AuthController extends Controller
{

   /**
     * Refresh the JWT token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    /**
     * Handle refreshing the JWT token.
     */

    /**
     * Handle refreshing the JWT token.
     */
    public function refreshToken(Request $request)
    {
        try {
            // Refresh the token
            $newToken = JWTAuth::refresh(JWTAuth::getToken());

            // Return the new token in the response
            return response()->json([
                'success' => true,
                'token' => $newToken,
            ], 200);
        } catch (\Exception $e) {
            // Handle exceptions such as expired token or no token found
            return response()->json([
                'success' => false,
                'message' => 'Unable to refresh token: ' . $e->getMessage(),
            ], 400);
        }
    }


    // route that check if the email or student Number already exist in the Alumni table
    public function checkAlumni(Request $request)
    {
        try {
            // Validate the input
            $request->validate([
                'email' => 'nullable|email',
                'student_number' => 'nullable|string|max:50',
            ]);
    
            // Ensure at least one field is provided
            if (!$request->email && !$request->student_number) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please provide either an email or student number.',
                ], 400);
            }
    
            // Search for the alumni based on email or student number
            $query = Alumni::query();
    
            if ($request->email) {
                $query->where('email', $request->email);
            }
    
            if ($request->student_number) {
                $query->orWhere('student_number', $request->student_number);
            }
    
            $alumni = $query->first();
    
            // Check if the alumni exists
            if (!$alumni) {
                return response()->json([
                    'success' => true,
                    'message' => 'No alumni found with the provided details.',
                ], 201); 
            }
    
            // Return the alumni data
            return response()->json([
                'success' => false,
                'data' => $alumni,
            ], 200);
    
        } catch (\Exception $e) {
            // Handle exceptions such as expired token or no token found
            return response()->json([
                'success' => false,
                'message' => 'Unable to check alumni: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function sendResetLink(Request $request)
    {
        try {
            
            $email = $request->email;
            $alumni = Alumni::where('email', $email)->first();
    
            if (!$alumni) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alumni not found.',
                ], 404);
            }
    
            // Generate a reset token (using Str::random() for uniqueness)
            $token = Str::random(60); 
    
            // find first if the email exist in the password_reset_tokens table
            $storedToken = DB::table('password_reset_tokens')->where('email', $email)->first();

            if ($storedToken) {
                // Update the token and expiration time
                DB::table('password_reset_tokens')->where('email', $email)->update([
                    'token' => Hash::make($token),
                    'expires_at' => Carbon::now()->addHour(),
                    'created_at' => Carbon::now(),
                ]);
            } else {
                // Store the token in the database with the email and expiration time (1 hour)
                DB::table('password_reset_tokens')->insert([
                    'email' => $email,
                    'token' => Hash::make($token),
                    'expires_at' => Carbon::now()->addHour(),
                    'created_at' => Carbon::now(),
                ]);
            }
    
            // Email content
            $subject = 'Password Reset Request';
            $body = "
                Dear {$alumni->first_name} {$alumni->last_name},
    
                You have requested to reset your password. Please paste the following token in the reset password form:
    
                $token
    
                If you did not request this, please ignore the email.
    
                Thank you,
                " . config('app.name') . "
            ";
    
            // Send the email
            Mail::raw($body, function ($message) use ($email, $subject) {
                $message->to($email)->subject($subject);
            });
    
            return response()->json([
                'success' => true,
                'message' => 'Password reset email sent successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send password reset email.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Existing method to verify token
    public function verifyResetToken(Request $request, $token)
    {
        try {
            // Fetch the token from the database
            $email = $request->query('email');

            // get the hash code 
            $storedToken = DB::table('password_reset_tokens')->where('email', $email)->first();
    
            if (!$storedToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not found.',
                ], 404);
            }

            // Verify if the token hash matches the stored token
            if (Hash::check($token, $storedToken->token)) {
                // Check if the token has expired
                $expiresAt = $storedToken->expires_at; 
                if (Carbon::now()->gt(Carbon::parse($expiresAt))) {
                    return response()->json([
                        'success' => false,
                        'message' => 'The reset token has expired.',
                    ], 400);
                }
                
                // Return a success response in html with the token
                return response()->json([
                    'success' => true,
                    'message' => 'Token is valid. You can now reset your password.',
                ], 200);
            }
    
            return response()->json([
                'success' => false,
                'message' => 'The reset token is invalid.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while verifying the token.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    
    // New method to reset the password
    public function resetPassword(Request $request, $token)
    {
        // Validate the new password
        $request->validate([
            'password' => 'required|confirmed|min:8',
        ]);

        $email = $request->email;
    
        try {
            // Fetch the token from the database
            $storedToken = DB::table('password_reset_tokens')->where('email', $email)->first();
            
            if (!$storedToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token not found.',
                ], 404);
            }
    
            // Check if the token has expired
            $expiresAt = $storedToken->expires_at; 
            if (Carbon::now()->gt(Carbon::parse($expiresAt))) {
                return response()->json([
                    'success' => false,
                    'message' => 'The reset token has expired.',
                ], 400);
            }
    
            // Find the alumni by the email stored with the token
            $alumni = Alumni::where('email', $storedToken->email)->first();
    
            if (!$alumni) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alumni not found.',
                ], 404);
            }
    
            // Update the alumni's password
            $alumni->password = Hash::make($request->password);
            $alumni->save();
    
            // Optionally, delete the token after password reset
            DB::table('password_reset_tokens')->where('token', $token)->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Your password has been successfully reset.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset password.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    // Search for a graduate
    public function searchGraduate(Request $request)
    {
        // Validate the input
        $request->validate([
            'email' => 'nullable|email',
            'student_number' => 'nullable|string|max:50',
        ]);

        // Ensure at least one field is provided
        if (!$request->email && !$request->student_number) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide either an email or student number.',
            ], 400);
        }

        // Search for the graduate based on email or student number
        $query = Graduate::query();

        if ($request->email) {
            $query->where('email_address', $request->email);
        }

        if ($request->student_number) {
            $query->orWhere('student_number', $request->student_number);
        }

        $graduate = $query->first();

        // Check if the graduate exists
        if (!$graduate) {
            return response()->json([
                'success' => false,
                'message' => 'No graduate found with the provided details.',
            ], 404);
        }

        // Return the graduate data
        return response()->json([
            'success' => true,
            'data' => $graduate,
        ], 200);
    }
    


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
                'student_number' => 'required|string|unique:alumni|max:255',
                
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
            'student_number' => $request->student_number,
            
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

    public function logout(Request $request)
    {
        try {
            // Invalidate the current token
            JWTAuth::invalidate(JWTAuth::getToken());
    
            return response()->json(['message' => 'Successfully logged out']);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to log out, please try again'], 500);
        }
    }
}
