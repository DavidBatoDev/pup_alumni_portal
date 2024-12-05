<?php

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Exception;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        try {
            // Authenticate the user using the token
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            // If the token is expired, return a 401 error
            return response()->json([
                'success' => false,
                'message' => 'Token has expired',
            ], 401);
        } catch (TokenInvalidException $e) {
            // If the token is invalid, return a 401 error
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid',
            ], 401);
        } catch (Exception $e) {
            // If no token is found or other errors occur, return a 401 error
            return response()->json([
                'success' => false,
                'message' => 'Authorization token not found',
            ], 401);
        }

        // If the token is valid, proceed with the request
        return $next($request);
    }
}
