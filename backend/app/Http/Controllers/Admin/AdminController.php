<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PendingRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard()
    {
        try {
            Log::info('Admin dashboard called by user: ' . auth()->id());
            
            $stats = [
                'total_users' => User::count(),
                'total_students' => User::where('role', 'student')->count(),
                'total_teachers' => User::where('role', 'teacher')->count(),
                'active_users' => User::where('is_active', true)->count(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(7))->count(),
                'pending_registrations' => PendingRegistration::where('status', 'pending')->count(),
            ];

            $recentUsers = User::latest()->take(5)->get();
            $pendingRegistrations = PendingRegistration::where('status', 'pending')
                ->latest()
                ->take(5)
                ->get();

            return response()->json([
                'stats' => $stats,
                'recent_users' => $recentUsers,
                'pending_registrations' => $pendingRegistrations
            ]);

        } catch (\Exception $e) {
            Log::error('Admin dashboard error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function pendingRegistrations()
    {
        try {
            $registrations = PendingRegistration::where('status', 'pending')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'registrations' => $registrations
            ]);

        } catch (\Exception $e) {
            Log::error('Pending registrations error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function approveRegistration(Request $request, PendingRegistration $registration)
    {
        try {
            if ($registration->status !== 'pending') {
                return response()->json([
                    'message' => 'Ta rejestracja została już przetworzona.'
                ], 422);
            }

            $request->validate([
                'notes' => 'nullable|string|max:500',
                'role' => 'nullable|in:student,teacher'
            ]);

            if ($request->role) {
                $registration->role = $request->role;
                $registration->save();
            }

            $user = $registration->approve(auth()->id(), $request->notes);

            return response()->json([
                'message' => 'Rejestracja została zaakceptowana. Użytkownik może się teraz zalogować.',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Approve registration error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectRegistration(Request $request, PendingRegistration $registration)
    {
        try {
            if ($registration->status !== 'pending') {
                return response()->json([
                    'message' => 'Ta rejestracja została już przetworzona.'
                ], 422);
            }

            $request->validate([
                'reason' => 'required|string|max:500'
            ]);

            $registration->reject(auth()->id(), $request->reason);

            return response()->json([
                'message' => 'Rejestracja została odrzucona.'
            ]);

        } catch (\Exception $e) {
            Log::error('Reject registration error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function users(Request $request)
    {
        try {
            $query = User::query();

            if ($request->role && $request->role !== 'all') {
                $query->where('role', $request->role);
            }

            if ($request->search) {
                $query->where(function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('email', 'like', '%' . $request->search . '%');
                });
            }

            $sortBy = $request->sort_by ?? 'created_at';
            $sortOrder = $request->sort_order ?? 'desc';
            $query->orderBy($sortBy, $sortOrder);

            $users = $query->get();

            return response()->json([
                'success' => true,
                'data' => $users
            ]);

        } catch (\Exception $e) {
            Log::error('Admin users error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Nie udało się pobrać użytkowników'
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
                'phone' => 'nullable|string|max:20',
                'instrument' => 'nullable|string|max:100',
                'bio' => 'nullable|string|max:1000',
                'is_active' => 'boolean'
            ]);

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'phone' => $request->phone,
                'instrument' => $request->instrument,
                'bio' => $request->bio,
                'is_active' => $request->is_active ?? $user->is_active,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Użytkownik został zaktualizowany pomyślnie',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Update user error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Nie udało się zaktualizować użytkownika'
            ], 500);
        }
    }

    public function deleteUser(User $user)
    {
        try {
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nie możesz usunąć swojego własnego konta'
                ], 422);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Użytkownik został usunięty pomyślnie'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete user error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Nie udało się usunąć użytkownika'
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
                'phone' => 'nullable|string|max:20',
                'instrument' => 'nullable|string|max:100',
                'bio' => 'nullable|string|max:1000',
                'is_active' => 'boolean'
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
                'success' => true,
                'message' => 'Użytkownik został utworzony pomyślnie',
                'data' => $user
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create user error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Nie udało się utworzyć użytkownika'
            ], 500);
        }
    }

    public function toggleUserStatus(User $user)
    {
        try {
            $user->update([
                'is_active' => !$user->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status użytkownika został zmieniony pomyślnie',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Toggle user status error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Nie udało się zmienić statusu użytkownika'
            ], 500);
        }
    }
}