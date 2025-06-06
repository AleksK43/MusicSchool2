<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    public function dashboard()
    {
        try {
            $student = auth()->user();
            
            // Sprawdź czy użytkownik to student
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony. Wymagane uprawnienia studenta.'
                ], 403);
            }

            $today = now();

            // Statystyki
            $stats = [
                'today_lessons' => Lesson::forStudent($student->id)->today()->count(),
                'week_lessons' => Lesson::forStudent($student->id)->thisWeek()->count(),
                'upcoming_lessons' => Lesson::forStudent($student->id)->upcoming()->count(),
                'completed_lessons' => Lesson::forStudent($student->id)
                    ->where('status', 'completed')
                    ->count(),
                'total_hours' => Lesson::forStudent($student->id)
                    ->where('status', 'completed')
                    ->get()
                    ->sum(function($lesson) {
                        return $lesson->start_time->diffInMinutes($lesson->end_time) / 60;
                    }),
                'unpaid_lessons' => Lesson::forStudent($student->id)
                    ->where('status', 'completed')
                    ->where('is_paid', false)
                    ->count(),
            ];

            // Dzisiejsze lekcje
            $todayLessons = Lesson::forStudent($student->id)
                ->today()
                ->with('teacher')
                ->orderBy('start_time')
                ->get();

            // Nadchodzące lekcje (następne 5)
            $upcomingLessons = Lesson::forStudent($student->id)
                ->upcoming()
                ->with('teacher')
                ->orderBy('start_time')
                ->take(5)
                ->get();

            // Ostatnie lekcje
            $recentLessons = Lesson::forStudent($student->id)
                ->where('status', 'completed')
                ->with('teacher')
                ->orderBy('start_time', 'desc')
                ->take(3)
                ->get();

            return response()->json([
                'stats' => $stats,
                'today_lessons' => $todayLessons,
                'upcoming_lessons' => $upcomingLessons,
                'recent_lessons' => $recentLessons,
                'student' => $student
            ]);

        } catch (\Exception $e) {
            Log::error('Student dashboard error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function calendar(Request $request)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            // Pobierz daty z requestu lub użyj domyślnych
            $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
            $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

            $lessons = Lesson::forStudent($student->id)
                ->inDateRange($startDate, $endDate)
                ->with('teacher')
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
            Log::error('Student calendar error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function lessons(Request $request)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $query = Lesson::forStudent($student->id)->with('teacher');

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

            // Sortowanie
            $sortBy = $request->get('sort_by', 'start_time');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            $lessons = $query->paginate($request->get('per_page', 15));

            return response()->json($lessons);

        } catch (\Exception $e) {
            Log::error('Student lessons error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function requestLesson(Request $request)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $request->validate([
                'teacher_id' => 'required|exists:users,id',
                'preferred_date' => 'required|date|after:now',
                'preferred_time' => 'required|date_format:H:i',
                'duration' => 'required|integer|min:30|max:120',
                'message' => 'nullable|string|max:500',
                'lesson_type' => 'required|in:individual,group',
            ]);

            // Sprawdź czy nauczyciel istnieje i ma rolę teacher
            $teacher = User::find($request->teacher_id);
            if (!$teacher || !$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Wybrany użytkownik nie jest nauczycielem.'
                ], 422);
            }

            // Kombinuj datę i czas
            $startTime = Carbon::parse($request->preferred_date . ' ' . $request->preferred_time);
            $endTime = $startTime->copy()->addMinutes($request->duration);

            // Sprawdź konflikty w kalendarzu nauczyciela
            $conflict = Lesson::forTeacher($teacher->id)
                ->where('status', '!=', 'cancelled')
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('start_time', [$startTime, $endTime])
                          ->orWhereBetween('end_time', [$startTime, $endTime])
                          ->orWhere(function($q) use ($startTime, $endTime) {
                              $q->where('start_time', '<=', $startTime)
                                ->where('end_time', '>=', $endTime);
                          });
                })
                ->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'Nauczyciel ma już zajęty ten termin. Wybierz inną godzinę.'
                ], 422);
            }

            // Sprawdź konflikty w kalendarzu studenta
            $studentConflict = Lesson::forStudent($student->id)
                ->where('status', '!=', 'cancelled')
                ->where(function($query) use ($startTime, $endTime) {
                    $query->whereBetween('start_time', [$startTime, $endTime])
                          ->orWhereBetween('end_time', [$startTime, $endTime])
                          ->orWhere(function($q) use ($startTime, $endTime) {
                              $q->where('start_time', '<=', $startTime)
                                ->where('end_time', '>=', $endTime);
                          });
                })
                ->exists();

            if ($studentConflict) {
                return response()->json([
                    'message' => 'Masz już zaplanowaną lekcję w tym czasie.'
                ], 422);
            }

            $lesson = Lesson::create([
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja ' . $student->instrument,
                'description' => $request->message,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'instrument' => $student->instrument,
                'lesson_type' => $request->lesson_type,
                'status' => 'pending', // Wymaga potwierdzenia nauczyciela
            ]);

            $lesson->load('teacher');

            // TODO: Wyślij powiadomienie do nauczyciela

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Prośba o lekcję została wysłana do nauczyciela. Otrzymasz powiadomienie o akceptacji.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Request lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function cancelLesson(Lesson $lesson)
    {
        try {
            $student = auth()->user();
            
            // Sprawdź czy lekcja należy do studenta
            if ($lesson->student_id !== $student->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do anulowania tej lekcji.'
                ], 403);
            }

            // Sprawdź czy można anulować (np. min. 24h wcześniej)
            if ($lesson->start_time->diffInHours(now()) < 24) {
                return response()->json([
                    'message' => 'Lekcję można anulować minimum 24 godziny wcześniej.'
                ], 422);
            }

            if (in_array($lesson->status, ['completed', 'cancelled'])) {
                return response()->json([
                    'message' => 'Nie można anulować tej lekcji.'
                ], 422);
            }

            $lesson->update(['status' => 'cancelled']);
            $lesson->load('teacher');

            // TODO: Wyślij powiadomienie do nauczyciela

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Lekcja została anulowana.'
            ]);

        } catch (\Exception $e) {
            Log::error('Cancel lesson error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function teachers()
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            // Pobierz dostępnych nauczycieli
            $teachers = User::where('role', 'teacher')
                ->where('is_active', true)
                ->select(['id', 'name', 'email', 'instrument', 'bio'])
                ->get();

            return response()->json([
                'teachers' => $teachers
            ]);

        } catch (\Exception $e) {
            Log::error('Student teachers error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getAvailableSlots(Request $request)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $request->validate([
                'teacher_id' => 'required|exists:users,id',
                'date' => 'required|date|after_or_equal:today',
            ]);

            $teacher = User::find($request->teacher_id);
            if (!$teacher->isTeacher()) {
                return response()->json([
                    'message' => 'Wybrany użytkownik nie jest nauczycielem.'
                ], 422);
            }

            $date = Carbon::parse($request->date);
            $startOfDay = $date->copy()->startOfDay();
            $endOfDay = $date->copy()->endOfDay();

            // Pobierz zajęte sloty
            $bookedLessons = Lesson::forTeacher($teacher->id)
                ->where('status', '!=', 'cancelled')
                ->whereBetween('start_time', [$startOfDay, $endOfDay])
                ->select(['start_time', 'end_time'])
                ->get();

            // Generuj dostępne sloty (przykład: 9:00-20:00, co 30 min)
            $availableSlots = [];
            $currentTime = $startOfDay->copy()->setTime(9, 0);
            $endTime = $startOfDay->copy()->setTime(20, 0);

            while ($currentTime < $endTime) {
                $slotEnd = $currentTime->copy()->addMinutes(45); // 45 min slot
                
                // Sprawdź czy slot nie koliduje z zajętymi
                $isAvailable = true;
                foreach ($bookedLessons as $lesson) {
                    if ($currentTime < $lesson->end_time && $slotEnd > $lesson->start_time) {
                        $isAvailable = false;
                        break;
                    }
                }

                if ($isAvailable && $currentTime > now()) {
                    $availableSlots[] = [
                        'start_time' => $currentTime->format('H:i'),
                        'end_time' => $slotEnd->format('H:i'),
                        'datetime' => $currentTime->toISOString(),
                    ];
                }

                $currentTime->addMinutes(30); // Co 30 min nowy slot
            }

            return response()->json([
                'date' => $date->toDateString(),
                'teacher' => $teacher->only(['id', 'name']),
                'available_slots' => $availableSlots
            ]);

        } catch (\Exception $e) {
            Log::error('Get available slots error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function approveReschedule(Lesson $lesson)
    {
        try {
            $student = auth()->user();
            
            if ($lesson->student_id !== $student->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do zatwierdzenia tej lekcji.'
                ], 403);
            }

            if ($lesson->status !== Lesson::STATUS_PENDING_STUDENT_APPROVAL) {
                return response()->json([
                    'message' => 'Brak oczekującej zmiany terminu do zatwierdzenia.'
                ], 422);
            }

            // Sprawdź ponownie konflikty w kalendarzu studenta
            $conflict = Lesson::forStudent($student->id)
                ->where('id', '!=', $lesson->id)
                ->where('status', '!=', Lesson::STATUS_CANCELLED)
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
                    'message' => 'Masz już zaplanowaną lekcję w proponowanym terminie.'
                ], 422);
            }

            $lesson->update(['status' => Lesson::STATUS_SCHEDULED]);
            $lesson->load('teacher');

            // TODO: Wyślij powiadomienie do nauczyciela

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Zmiana terminu została zatwierdzona.'
            ]);

        } catch (\Exception $e) {
            Log::error('Approve reschedule error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectReschedule(Request $request, Lesson $lesson)
    {
        try {
            $student = auth()->user();
            
            if ($lesson->student_id !== $student->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do odrzucenia tej zmiany.'
                ], 403);
            }

            if ($lesson->status !== Lesson::STATUS_PENDING_STUDENT_APPROVAL) {
                return response()->json([
                    'message' => 'Brak oczekującej zmiany terminu do odrzucenia.'
                ], 422);
            }

            $request->validate([
                'reason' => 'nullable|string|max:500'
            ]);

            $lesson->update([
                'status' => Lesson::STATUS_CANCELLED,
                'notes' => $request->reason ? 'Student odrzucił zmianę: ' . $request->reason : 'Student odrzucił zmianę terminu'
            ]);
            $lesson->load('teacher');

            // TODO: Wyślij powiadomienie do nauczyciela

            return response()->json([
                'lesson' => $lesson,
                'message' => 'Zmiana terminu została odrzucona.'
            ]);

        } catch (\Exception $e) {
            Log::error('Reject reschedule error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function pendingApprovals()
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $pendingApprovals = Lesson::forStudent($student->id)
                ->where('status', Lesson::STATUS_PENDING_STUDENT_APPROVAL)
                ->with('teacher')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'pending_approvals' => $pendingApprovals
            ]);

        } catch (\Exception $e) {
            Log::error('Pending approvals error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function monthlyCalendar($year, $month)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            // Walidacja roku i miesiąca
            if (!is_numeric($year) || !is_numeric($month) || $month < 1 || $month > 12) {
                return response()->json([
                    'message' => 'Nieprawidłowy rok lub miesiąc.'
                ], 422);
            }

            // Utworzenie dat dla całego miesiąca
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            $lessons = Lesson::forStudent($student->id)
                ->inDateRange($startDate, $endDate)
                ->with(['teacher' => function($query) {
                    $query->select('id', 'name', 'instrument');
                }])
                ->orderBy('start_time')
                ->get();

            return response()->json([
                'lessons' => $lessons,
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                    'year' => (int)$year,
                    'month' => (int)$month
                ],
                'summary' => [
                    'total_lessons' => $lessons->count(),
                    'scheduled' => $lessons->where('status', 'scheduled')->count(),
                    'pending' => $lessons->where('status', 'pending')->count(),
                    'completed' => $lessons->where('status', 'completed')->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Student monthly calendar error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => 'Nie udało się pobrać kalendarza.'
            ], 500);
        }
    }
}