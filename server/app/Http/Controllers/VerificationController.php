<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\Graduate;

class VerificationController extends Controller
{
    public function sendVerificationEmail(Request $request)
    {
        // Validate the input
        $request->validate([
            'email' => 'required|email|exists:graduates,email_address',
        ]);
    
        $email = $request->email;
        $graduate = \App\Models\Graduate::where('email_address', $email)->first();
    
        if (!$graduate) {
            return response()->json([
                'success' => false,
                'message' => 'Graduate not found.',
            ], 404);
        }
    
        // Generate a verification token (e.g., hash of email and timestamp)
        $token = base64_encode($graduate->email_address . '|' . now()->timestamp);
    
        // Generate the verification URL
        $verificationUrl = url('/api/verify-email?token=' . $token);
    
        // Email content
        $subject = 'Email Verification';
        $body = "
            Dear {$graduate->firstname} {$graduate->lastname},
    
            Please click the link below to verify your email address:
    
            $verificationUrl
    
            If you did not request this, please ignore the email.
    
            Thank you,
            " . config('app.name') . "
        ";
    
        try {
            // Send the email
            Mail::raw($body, function ($message) use ($email, $subject) {
                $message->to($email)->subject($subject);
            });
    
            return response()->json([
                'success' => true,
                'message' => 'Verification email sent successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification email.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function verifyEmail(Request $request)
    {
        // Validate the token
        $request->validate([
            'token' => 'required|string',
        ]);

        // Decode the token
        $decodedToken = base64_decode($request->token);
        [$email, $timestamp] = explode('|', $decodedToken);

        // Validate the email and check if the token is still valid (e.g., within 24 hours)
        $graduate = \App\Models\Graduate::where('email_address', $email)->first();

        if (!$graduate) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired token.',
            ], 400);
        }

        // Mark the email as verified
        $graduate->update(['verified_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ], 200);
    }


    public function checkVerification(Request $request)
    {
        // Validate the email input
        $request->validate([
            'email' => 'required|email',
        ]);

        // Find the graduate by email
        $graduate = Graduate::where('email_address', $request->email)->first();

        // Check if the graduate exists
        if (!$graduate) {
            return response()->json([
                'success' => false,
                'message' => 'Graduate not found.',
            ], 404);
        }

        // Check if the email is verified
        if ($graduate->verified_at) {
            return response()->json([
                'success' => true,
                'message' => 'Email is verified.',
                'data' => [
                    'verified_at' => $graduate->verified_at,
                ],
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Email is not verified.',
        ], 403);
    }
        
}
