<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('AdminMiddleware check for user: ' . auth()->id());
        
        if (!$request->user()) {
            Log::warning('AdminMiddleware: No authenticated user');
            return response()->json([
                'message' => 'Nie jesteś zalogowany.'
            ], 401);
        }
        
        if (!$request->user()->isAdmin()) {
            Log::warning('AdminMiddleware: User is not admin. Role: ' . $request->user()->role);
            return response()->json([
                'message' => 'Dostęp zabroniony. Wymagane uprawnienia administratora.'
            ], 403);
        }

        Log::info('AdminMiddleware: Access granted for admin user');
        return $next($request);
    }
}