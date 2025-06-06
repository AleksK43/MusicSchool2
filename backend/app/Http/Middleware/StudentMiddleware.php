<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Nie jesteś zalogowany.'
            ], 401);
        }
        
        if ($request->user()->role !== 'student') {
            return response()->json([
                'message' => 'Dostęp zabroniony. Wymagane uprawnienia studenta.'
            ], 403);
        }

        return $next($request);
    }
}