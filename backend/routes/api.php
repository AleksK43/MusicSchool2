<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Teacher\TeacherController;
use App\Http\Controllers\Student\StudentController;

// Test route dla sprawdzenia czy API działa
Route::get('/test', fn() => response()->json(['message' => 'API is working', 'timestamp' => now()]));

// Public routes (nie wymagają autoryzacji)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes (wymagają autoryzacji)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::put('/users/{user}', [AdminController::class, 'updateUser']);
        Route::patch('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    });

    // Teacher routes
    Route::middleware('teacher')->prefix('teacher')->group(function () {
        // Dashboard i podstawowe widoki
        Route::get('/dashboard', [TeacherController::class, 'dashboard']);
        Route::get('/calendar', [TeacherController::class, 'calendar']);
        Route::get('/lessons', [TeacherController::class, 'lessons']);
        Route::get('/students', [TeacherController::class, 'students']);
        
        // Zarządzanie lekcjami
        Route::post('/lessons', [TeacherController::class, 'createLesson']);
        Route::put('/lessons/{lesson}', [TeacherController::class, 'updateLesson']);
        Route::delete('/lessons/{lesson}', [TeacherController::class, 'deleteLesson']);
        
        // Prośby o lekcje od studentów
        Route::get('/pending-requests', [TeacherController::class, 'pendingRequests']);
        Route::patch('/lessons/{lesson}/approve', [TeacherController::class, 'approveLesson']);
        Route::patch('/lessons/{lesson}/reject', [TeacherController::class, 'rejectLesson']);
        Route::patch('/lessons/{lesson}/propose-alternative', [TeacherController::class, 'proposeAlternative']);
        
        // Dostępność nauczyciela
        Route::get('/availability', [TeacherController::class, 'getTeacherAvailability']);
    });

    // Student routes
    Route::middleware('student')->prefix('student')->group(function () {
        // Dashboard i kalendarz
        Route::get('/dashboard', [StudentController::class, 'dashboard']);
        Route::get('/calendar', [StudentController::class, 'calendar']);
        Route::get('/lessons', [StudentController::class, 'lessons']);
        
        // Rezerwacja lekcji
        Route::post('/request-lesson', [StudentController::class, 'requestLesson']);
        Route::delete('/lessons/{lesson}/cancel', [StudentController::class, 'cancelLesson']);
        
        // Nauczyciele i dostępność
        Route::get('/teachers', [StudentController::class, 'teachers']);
        Route::get('/teachers/{teacher}/available-slots', [StudentController::class, 'getAvailableSlots']);
        
        // Akceptacja zmian terminów
        Route::get('/pending-approvals', [StudentController::class, 'pendingApprovals']);
        Route::patch('/lessons/{lesson}/approve-reschedule', [StudentController::class, 'approveReschedule']);
        Route::patch('/lessons/{lesson}/reject-reschedule', [StudentController::class, 'rejectReschedule']);
    });
    
    // Shared routes (dla wszystkich zalogowanych użytkowników)
    Route::prefix('shared')->group(function () {
        // Pobierz dostępnych nauczycieli (dla studentów i adminów)
        Route::get('/teachers', fn() => response()->json([
            'teachers' => \App\Models\User::where('role', 'teacher')
                ->where('is_active', true)
                ->select(['id', 'name', 'email', 'instrument', 'bio'])
                ->get()
        ]));
        
        // Pobierz studentów (dla nauczycieli i adminów)
        Route::get('/students', fn() => response()->json([
            'students' => \App\Models\User::where('role', 'student')
                ->where('is_active', true)
                ->select(['id', 'name', 'email', 'instrument'])
                ->get()
        ]));
    });
});

// Fallback route
Route::fallback(fn() => response()->json([
    'message' => 'Route not found'
], 404));
