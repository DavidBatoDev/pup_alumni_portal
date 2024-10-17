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
            // Try to authenticate using the token
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            // Return a 401 response for expired tokens
            return response()->json(['error' => 'Token has expired'], 401);
        } catch (TokenInvalidException $e) {
            // Return a 401 response for invalid tokens
            return response()->json(['error' => 'Token is invalid'], 401);
        } catch (Exception $e) {
            // Return a 401 response for any other token issues
            return response()->json(['error' => 'Authorization token not found'], 401);
        }

        // If token is valid, proceed with the request
        return $next($request);
    }
}
