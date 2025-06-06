<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // W Laravel 11 middleware definiuje się w routes, nie w konstruktorze
    
    public function dashboard()
    {
        try {
            Log::info('Dashboard request by user: ' . auth()->id());
            
            $stats = [
                'total_users' => User::count(),
                'total_students' => User::where('role', 'student')->count(),
                'total_teachers' => User::where('role', 'teacher')->count(),
                'active_users' => User::where('is_active', true)->count(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(7))->count(),
            ];

            $recentUsers = User::latest()->take(5)->get();

            return response()->json([
                'stats' => $stats,
                'recent_users' => $recentUsers
            ]);
            
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function users(Request $request)
    {
        try {
            $query = User::query();

            // Filtering
            if ($request->has('role') && $request->role !== 'all') {
                $query->where('role', $request->role);
            }

            if ($request->has('search') && $request->search) {
                $query->where(function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $users = $query->paginate($request->get('per_page', 15));

            return response()->json($users);
            
        } catch (\Exception $e) {
            Log::error('Users list error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, User $user)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'role' => 'required|in:student,teacher,admin',
                'is_active' => 'boolean',
                'phone' => 'nullable|string',
                'instrument' => 'nullable|string',
                'bio' => 'nullable|string',
            ]);

            $user->update($request->all());

            return response()->json([
                'user' => $user,
                'message' => 'Użytkownik zaktualizowany pomyślnie'
            ]);
            
        } catch (\Exception $e) {
            Log::error('User update error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser(User $user)
    {
        try {
            // Nie pozwalaj usunąć siebie
            if ($user->id === auth()->id()) {
                return response()->json([
                    'message' => 'Nie możesz usunąć swojego konta'
                ], 403);
            }

            $user->delete();

            return response()->json([
                'message' => 'Użytkownik usunięty pomyślnie'
            ]);
            
        } catch (\Exception $e) {
            Log::error('User delete error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createUser(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|in:student,teacher,admin',
                'phone' => 'nullable|string',
                'instrument' => 'nullable|string',
                'bio' => 'nullable|string',
                'is_active' => 'boolean',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'phone' => $request->phone,
                'instrument' => $request->instrument,
                'bio' => $request->bio,
                'is_active' => $request->is_active ?? true,
            ]);

            return response()->json([
                'user' => $user,
                'message' => 'Użytkownik utworzony pomyślnie'
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('User create error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleUserStatus(User $user)
    {
        try {
            // Nie pozwalaj dezaktywować siebie
            if ($user->id === auth()->id()) {
                return response()->json([
                    'message' => 'Nie możesz dezaktywować swojego konta'
                ], 403);
            }

            $user->update(['is_active' => !$user->is_active]);

            return response()->json([
                'user' => $user,
                'message' => $user->is_active ? 'Użytkownik aktywowany' : 'Użytkownik dezaktywowany'
            ]);
            
        } catch (\Exception $e) {
            Log::error('User status toggle error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}