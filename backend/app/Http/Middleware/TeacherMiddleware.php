<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TeacherMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('TeacherMiddleware check for user: ' . auth()->id());
        
        if (!$request->user()) {
            Log::warning('TeacherMiddleware: No authenticated user');
            return response()->json([
                'message' => 'Nie jesteś zalogowany.'
            ], 401);
        }
        
        if ($request->user()->role !== 'teacher') {
            Log::warning('TeacherMiddleware: User is not teacher. Role: ' . $request->user()->role);
            return response()->json([
                'message' => 'Dostęp zabroniony. Wymagane uprawnienia nauczyciela.'
            ], 403);
        }

        Log::info('TeacherMiddleware: Access granted for teacher user');
        return $next($request);
    }
}