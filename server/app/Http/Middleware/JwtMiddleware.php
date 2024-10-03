<?php
// server/app/Http/Middleware/JwtMiddleware.php
namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Illuminate\Http\Request;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Check if the token is valid
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            // If the token is expired, return a specific error response
            return response()->json(['error' => 'Token has expired'], 401);
        } catch (TokenInvalidException $e) {
            // If the token is invalid, return a specific error response
            return response()->json(['error' => 'Token is invalid'], 401);
        } catch (Exception $e) {
            // If no token is provided or other issues arise
            return response()->json(['error' => $e], 401);
        }

        // If the token is valid, proceed with the request
        return $next($request);
    }
}
