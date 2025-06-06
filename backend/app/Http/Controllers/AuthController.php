<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PendingRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|unique:pending_registrations,email',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
            'phone' => 'nullable|string|max:20',
            'instrument' => 'nullable|string|max:100',
            'experience' => 'nullable|string|max:100',
        ]);

        // Sprawdź czy email nie istnieje już w pending_registrations
        $existingPending = PendingRegistration::where('email', $request->email)->first();
        if ($existingPending) {
            if ($existingPending->status === 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Twoja rejestracja oczekuje na akceptację administratora.'
                ], 422);
            } elseif ($existingPending->status === 'rejected') {
                return response()->json([
                    'success' => false,
                    'message' => 'Twoja poprzednia rejestracja została odrzucona. Skontaktuj się z administratorem.'
                ], 422);
            }
        }

        // Stwórz oczekującą rejestrację
        $pendingRegistration = PendingRegistration::create([
            'name' => $request->firstName . ' ' . $request->lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'instrument' => $request->instrument,
            'experience' => $request->experience,
            'role' => 'student', // Domyślnie student - administrator może to zmienić
            'status' => 'pending',
        ]);

        // Zwróć odpowiedź sukcesu
        return response()->json([
            'success' => true,
            'message' => 'Rejestracja została wysłana! Administrator sprawdzi Twoje dane i aktywuje konto w ciągu 24 godzin.',
            'data' => [
                'registration_id' => $pendingRegistration->id,
                'email' => $pendingRegistration->email,
                'status' => $pendingRegistration->status
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Nieprawidłowy email lub hasło.'],
            ]);
        }

        $user = Auth::user();
        
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Konto zostało dezaktywowane.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Logowanie zakończone pomyślnie'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Wylogowano pomyślnie'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}