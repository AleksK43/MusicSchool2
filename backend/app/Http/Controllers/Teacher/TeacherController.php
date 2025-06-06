<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class TeacherController extends Controller
{
    public function dashboard()
    {
        try {
            Log::info('Teacher dashboard called', ['user_id' => auth()->id()]);
            
            $teacher = auth()->user();
            
            if (!$teacher) {
                Log::error('No authenticated user');
                return response()->json(['message' => 'Nie jesteś zalogowany.'], 401);
            }
            
            Log::info('User role: ' . $teacher->role);
            
            // Sprawdź czy użytkownik to nauczyciel
            if (!$teacher->isTeacher()) {
                Log::warning('User is not teacher');
                return response()->json([
                    'message' => 'Dostęp zabroniony. Wymagane uprawnienia nauczyciela.'
                ], 403);
            }

            $today = now();
            $startOfWeek = $today->copy()->startOfWeek();
            $endOfWeek = $today->copy()->endOfWeek();

            // Statystyki
            $stats = [
                'today_lessons' => Lesson::forTeacher($teacher->id)->today()->count(),
                'week_lessons' => Lesson::forTeacher($teacher->id)->thisWeek()->count(),
                'upcoming_lessons' => Lesson::forTeacher($teacher->id)->upcoming()->count(),
                'total_students' => Lesson::forTeacher($teacher->id)
                    ->distinct('student_id')
                    ->count('student_id'),
                'completed_this_month' => Lesson::forTeacher($teacher->id)
                    ->where('status', 'completed')
                    ->whereMonth('start_time', $today->month)
                    ->count(),
            ];

            // Dzisiejsze lekcje
            $todayLessons = Lesson::forTeacher($teacher->id)
                ->today()
                ->with('student')
                ->orderBy('start_time')
                ->get();

            // Nadchodzące lekcje (następne 5)
            $upcomingLessons = Lesson::forTeacher($teacher->id)
                ->upcoming()
                ->with('student')
                ->orderBy('start_time')
                ->take(5)
                ->get();

            return response()->json([
                'stats' => $stats,
                'today_lessons' => $todayLessons,
                'upcoming_lessons' => $upcomingLessons,
                'teacher' => $teacher
            ]);

        } catch (\Exception $e) {
            Log::error('Teacher dashboard error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function calendar(Request $request)
    {
        try {
            $teacher = auth()->user();
            
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            // Pobierz daty z requestu lub użyj domyślnych
            $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

            $lessons = Lesson::forTeacher($teacher->id)
                ->inDateRange($startDate, $endDate)
                ->with('student')
                ->orderBy('start_time')
                ->get();

            return response()->json([
                'lessons' => $lessons,
                'period' => [
                    'start' => $startDate,
                    'end' => $endDate
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Teacher calendar error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function lessons(Request $request)
    {
        try {
            $teacher = auth()->user();
            
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $query = Lesson::forTeacher($teacher->id)->with('student');

            // Filtry
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from') && $request->date_from) {
                $query->where('start_time', '>=', $request->date_from);
            }

            if ($request->has('date_to') && $request->date_to) {
                $query->where('start_time', '<=', $request->date_to);
            }

            if ($request->has('student_id') && $request->student_id) {
                $query->where('student_id', $request->student_id);
            }

            // Sortowanie
            $sortBy = $request->get('sort_by', 'start_time');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $lessons = $query->paginate($request->get('per_page', 15));

            return response()->json($lessons);

        } catch (\Exception $e) {
            Log::error('Teacher lessons error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function createLesson(Request $request)
    {
        try {
            $teacher = auth()->user();
            
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $request->validate([
                'student_id' => 'required|exists:users,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date|after:now',
                'end_time' => 'required|date|after:start_time',
                'instrument' => 'nullable|string',
                'price' => 'nullable|numeric|min:0',
                'lesson_type' => 'required|in:individual,group',
                'location' => 'nullable|string',
            ]);

            // Sprawdź czy student istnieje i ma rolę student
            $student = User::find($request->student_id);
            if (!$student || !$student->isStudent()) {
                return response()->json([
                    'message' => 'Wybrany użytkownik nie jest studentem.'
                ], 422);
            }

            // Sprawdź konflikty w kalendarzu nauczyciela
            $conflict = Lesson::forTeacher($teacher->id)
                ->where('status', 'scheduled')
                ->where(function($query) use ($request) {
                    $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                          ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                          ->orWhere(function($q) use ($request) {
                              $q->where('start_time', '<=', $request->start_time)
                                ->where('end_time', '>=', $request->end_time);
                          });
                })
                ->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'W tym czasie masz już zaplanowaną lekcję.'
                ], 422);
            }

            $lesson = Lesson::create([
                'teacher_id' => $teacher->id,
                'student_id' => $request->student_id,
                'title' => $request->title,
                'description' => $request->description,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'instrument' => $request->instrument,
                'price' => $request->price,
                'lesson_type' => $request->lesson_type,
                'location' => $request->location,
                'status' => 'scheduled',
            ]);

            $lesson->load('student');

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Lekcja została utworzona pomyślnie.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function updateLesson(Request $request, Lesson $lesson)
    {
        try {
            $teacher = auth()->user();
            
            // Sprawdź czy lekcja należy do nauczyciela
            if ($lesson->teacher_id !== $teacher->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do edycji tej lekcji.'
                ], 403);
            }

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'status' => 'required|in:scheduled,completed,cancelled,no_show',
                'notes' => 'nullable|string',
                'price' => 'nullable|numeric|min:0',
                'is_paid' => 'boolean',
                'location' => 'nullable|string',
            ]);

            $lesson->update($request->all());
            $lesson->load('student');

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Lekcja została zaktualizowana pomyślnie.'
            ]);

        } catch (\Exception $e) {
            Log::error('Update lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteLesson(Lesson $lesson)
    {
        try {
            $teacher = auth()->user();
            
            if ($lesson->teacher_id !== $teacher->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do usunięcia tej lekcji.'
                ], 403);
            }

            $lesson->delete();

            return response()->json([
                'message' => 'Lekcja została usunięta pomyślnie.'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function students()
    {
        try {
            $teacher = auth()->user();
            
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            // Pobierz studentów, którzy mają/mieli lekcje z tym nauczycielem
            $students = User::where('role', 'student')
                ->whereHas('studentLessons', function($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                })
                ->withCount(['studentLessons as lessons_count' => function($query) use ($teacher) {
                    $query->where('teacher_id', $teacher->id);
                }])
                ->get();

            return response()->json([
                'students' => $students
            ]);

        } catch (\Exception $e) {
            Log::error('Teacher students error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function pendingRequests()
    {
        try {
            $teacher = auth()->user();
            
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $pendingLessons = Lesson::forTeacher($teacher->id)
                ->where('status', 'pending')
                ->with('student')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'pending_requests' => $pendingLessons
            ]);

        } catch (\Exception $e) {
            Log::error('Pending requests error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function approveLesson(Lesson $lesson)
    {
        try {
            $teacher = auth()->user();
            
            if ($lesson->teacher_id !== $teacher->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do zatwierdzenia tej lekcji.'
                ], 403);
            }

            if ($lesson->status !== 'pending') {
                return response()->json([
                    'message' => 'Lekcja nie oczekuje na zatwierdzenie.'
                ], 422);
            }

            // Sprawdź ponownie konflikty (mogły się pojawić w międzyczasie)
            $conflict = Lesson::forTeacher($teacher->id)
                ->where('id', '!=', $lesson->id)
                ->where('status', 'scheduled')
                ->where(function($query) use ($lesson) {
                    $query->whereBetween('start_time', [$lesson->start_time, $lesson->end_time])
                          ->orWhereBetween('end_time', [$lesson->start_time, $lesson->end_time])
                          ->orWhere(function($q) use ($lesson) {
                              $q->where('start_time', '<=', $lesson->start_time)
                                ->where('end_time', '>=', $lesson->end_time);
                          });
                })
                ->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'W tym czasie masz już zaplanowaną inną lekcję.'
                ], 422);
            }

            $lesson->update(['status' => 'scheduled']);
            $lesson->load('student');

            // TODO: Wyślij powiadomienie do studenta

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Lekcja została zatwierdzona.'
            ]);

        } catch (\Exception $e) {
            Log::error('Approve lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectLesson(Request $request, Lesson $lesson)
    {
        try {
            $teacher = auth()->user();
            
            if ($lesson->teacher_id !== $teacher->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do odrzucenia tej lekcji.'
                ], 403);
            }

            if ($lesson->status !== 'pending') {
                return response()->json([
                    'message' => 'Lekcja nie oczekuje na zatwierdzenie.'
                ], 422);
            }

            $request->validate([
                'reason' => 'nullable|string|max:500'
            ]);

            $lesson->update([
                'status' => 'cancelled',
                'notes' => $request->reason ? 'Odrzucona: ' . $request->reason : 'Odrzucona przez nauczyciela'
            ]);
            $lesson->load('student');

            // TODO: Wyślij powiadomienie do studenta z powodem

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Prośba o lekcję została odrzucona.'
            ]);

        } catch (\Exception $e) {
            Log::error('Reject lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function proposeAlternative(Request $request, Lesson $lesson)
    {
        try {
            $teacher = auth()->user();
            
            if ($lesson->teacher_id !== $teacher->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do modyfikacji tej lekcji.'
                ], 403);
            }

            if ($lesson->status !== 'pending') {
                return response()->json([
                    'message' => 'Lekcja nie oczekuje na zatwierdzenie.'
                ], 422);
            }

            $request->validate([
                'new_start_time' => 'required|date|after:now',
                'new_end_time' => 'required|date|after:new_start_time',
                'message' => 'nullable|string|max:500'
            ]);

            // Sprawdź konflikty dla nowego terminu
            $conflict = Lesson::forTeacher($teacher->id)
                ->where('id', '!=', $lesson->id)
                ->where('status', 'scheduled')
                ->where(function($query) use ($request) {
                    $query->whereBetween('start_time', [$request->new_start_time, $request->new_end_time])
                          ->orWhereBetween('end_time', [$request->new_start_time, $request->new_end_time])
                          ->orWhere(function($q) use ($request) {
                              $q->where('start_time', '<=', $request->new_start_time)
                                ->where('end_time', '>=', $request->new_end_time);
                          });
                })
                ->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'Proponowany termin koliduje z inną lekcją.'
                ], 422);
            }

            $lesson->update([
                'start_time' => $request->new_start_time,
                'end_time' => $request->new_end_time,
                'status' => 'pending_student_approval', // Nowy status
                'notes' => $request->message ? 'Propozycja nauczyciela: ' . $request->message : 'Nauczyciel zaproponował inny termin'
            ]);
            $lesson->load('student');

            // TODO: Wyślij powiadomienie do studenta o nowym terminie

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Zaproponowano alternatywny termin.'
            ]);

        } catch (\Exception $e) {
            Log::error('Propose alternative error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeacherAvailability(Request $request)
    {
        try {
            $teacher = auth()->user();
            
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            // Pobierz zajęte terminy
            $bookedLessons = Lesson::forTeacher($teacher->id)
                ->where('status', '!=', 'cancelled')
                ->whereBetween('start_time', [$startDate, $endDate])
                ->select(['start_time', 'end_time', 'status'])
                ->get();

            // Generuj plan dostępności (przykład: Pn-Pt 9:00-20:00)
            $availability = [];
            $current = $startDate->copy();

            while ($current <= $endDate) {
                // Pomiń weekendy (opcjonalnie)
                if ($current->isWeekday()) {
                    $dayStart = $current->copy()->setTime(9, 0);
                    $dayEnd = $current->copy()->setTime(20, 0);
                    
                    $daySlots = [];
                    $currentSlot = $dayStart->copy();
                    
                    while ($currentSlot < $dayEnd) {
                        $slotEnd = $currentSlot->copy()->addMinutes(45);
                        
                        // Sprawdź czy slot jest zajęty
                        $isBooked = false;
                        foreach ($bookedLessons as $lesson) {
                            if ($currentSlot < $lesson->end_time && $slotEnd > $lesson->start_time) {
                                $isBooked = true;
                                break;
                            }
                        }
                        
                        $daySlots[] = [
                            'time' => $currentSlot->format('H:i'),
                            'datetime' => $currentSlot->toISOString(),
                            'is_available' => !$isBooked && $currentSlot > now()
                        ];
                        
                        $currentSlot->addMinutes(30);
                    }
                    
                    $availability[] = [
                        'date' => $current->toDateString(),
                        'day_name' => $current->format('l'),
                        'slots' => $daySlots
                    ];
                }
                
                $current->addDay();
            }

            return response()->json([
                'teacher' => $teacher->only(['id', 'name']),
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString()
                ],
                'availability' => $availability
            ]);

        } catch (\Exception $e) {
            Log::error('Get teacher availability error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}