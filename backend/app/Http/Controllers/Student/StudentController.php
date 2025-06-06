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
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony. Wymagane uprawnienia studenta.'
                ], 403);
            }

            $today = now();

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

            $todayLessons = Lesson::forStudent($student->id)
                ->today()
                ->with('teacher')
                ->orderBy('start_time')
                ->get();

            $upcomingLessons = Lesson::forStudent($student->id)
                ->upcoming()
                ->with('teacher')
                ->orderBy('start_time')
                ->take(5)
                ->get();

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

    public function calendarRange(Request $request)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();

            $lessons = Lesson::forStudent($student->id)
                ->whereBetween('start_time', [$startDate, $endDate])
                ->with(['teacher' => function($query) {
                    $query->select('id', 'name', 'email', 'instrument');
                }])
                ->orderBy('start_time')
                ->get();

            return response()->json([
                'lessons' => $lessons,
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString()
                ],
                'total_lessons' => $lessons->count(),
                'stats' => [
                    'scheduled' => $lessons->where('status', 'scheduled')->count(),
                    'completed' => $lessons->where('status', 'completed')->count(),
                    'pending' => $lessons->where('status', 'pending')->count(),
                    'cancelled' => $lessons->where('status', 'cancelled')->count(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Student calendar range error: ' . $e->getMessage());
            
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

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('date_from') && $request->date_from) {
                $query->where('start_time', '>=', $request->date_from);
            }

            if ($request->has('date_to') && $request->date_to) {
                $query->where('start_time', '<=', $request->date_to);
            }

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
                'preferred_date' => 'required|date|after:today',
                'preferred_time' => 'required|date_format:H:i',
                'duration' => 'required|integer|min:30|max:120',
                'message' => 'nullable|string|max:500',
                'lesson_type' => 'required|in:individual,group'
            ]);

            $teacher = User::where('role', 'teacher')
                ->where('is_active', true)
                ->find($request->teacher_id);

            if (!$teacher) {
                return response()->json([
                    'message' => 'Nauczyciel nie został znaleziony lub nie jest aktywny.'
                ], 404);
            }

            $startDateTime = Carbon::parse($request->preferred_date . ' ' . $request->preferred_time);
            $endDateTime = $startDateTime->copy()->addMinutes($request->duration);

            $conflictingLesson = Lesson::where('teacher_id', $request->teacher_id)
                ->where('status', '!=', 'cancelled')
                ->where(function($query) use ($startDateTime, $endDateTime) {
                    $query->whereBetween('start_time', [$startDateTime, $endDateTime])
                          ->orWhereBetween('end_time', [$startDateTime, $endDateTime])
                          ->orWhere(function($q) use ($startDateTime, $endDateTime) {
                              $q->where('start_time', '<=', $startDateTime)
                                ->where('end_time', '>=', $endDateTime);
                          });
                })
                ->first();

            if ($conflictingLesson) {
                return response()->json([
                    'message' => 'Wybrany termin jest już zajęty. Wybierz inny termin.'
                ], 422);
            }

            $lesson = Lesson::create([
                'student_id' => $student->id,
                'teacher_id' => $request->teacher_id,
                'title' => 'Lekcja ' . ($teacher->instrument ?: 'muzyki'),
                'description' => $request->message,
                'start_time' => $startDateTime,
                'end_time' => $endDateTime,
                'status' => 'pending',
                'lesson_type' => $request->lesson_type,
                'location' => 'Do ustalenia',
                'price' => null, 
                'is_paid' => false
            ]);

            return response()->json([
                'message' => 'Prośba o lekcję została wysłana do nauczyciela.',
                'lesson' => $lesson->load(['teacher', 'student'])
            ]);

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
            
            if ($lesson->student_id !== $student->id) {
                return response()->json([
                    'message' => 'Nie masz uprawnień do anulowania tej lekcji.'
                ], 403);
            }

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

            $bookedLessons = Lesson::forTeacher($teacher->id)
                ->where('status', '!=', 'cancelled')
                ->whereBetween('start_time', [$startOfDay, $endOfDay])
                ->select(['start_time', 'end_time'])
                ->get();

            $availableSlots = [];
            $currentTime = $startOfDay->copy()->setTime(9, 0);
            $endTime = $startOfDay->copy()->setTime(20, 0);

            while ($currentTime < $endTime) {
                $slotEnd = $currentTime->copy()->addMinutes(45); // 45 min slot
                
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

                $currentTime->addMinutes(30); 
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
    public function monthlyCalendar(Request $request, $year, $month)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            if (!is_numeric($year) || !is_numeric($month) || $month < 1 || $month > 12) {
                return response()->json([
                    'message' => 'Nieprawidłowy rok lub miesiąc.'
                ], 422);
            }

            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            $lessons = Lesson::forStudent($student->id)
                ->whereBetween('start_time', [$startDate, $endDate])
                ->with('teacher')
                ->orderBy('start_time')
                ->get();

            return response()->json([
                'lessons' => $lessons,
                'period' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString(),
                    'year' => (int)$year,
                    'month' => (int)$month
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Student monthly calendar error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeachers(Request $request)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $teachers = User::where('role', 'teacher')
                ->where('is_active', true)
                ->select('id', 'name', 'email', 'phone', 'instrument', 'bio')
                ->orderBy('name')
                ->get();

            return response()->json([
                'teachers' => $teachers
            ]);

        } catch (\Exception $e) {
            Log::error('Get teachers error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getTeacherAvailableSlots(Request $request, $teacherId)
    {
        try {
            $student = auth()->user();
            
            if (!$student->isStudent()) {
                return response()->json([
                    'message' => 'Dostęp zabroniony.'
                ], 403);
            }

            $request->validate([
                'date' => 'required|date|after:today',
                'duration' => 'sometimes|integer|min:30|max:120'
            ]);

            $teacher = User::where('role', 'teacher')
                ->where('is_active', true)
                ->find($teacherId);

            if (!$teacher) {
                return response()->json([
                    'message' => 'Nauczyciel nie został znaleziony.'
                ], 404);
            }

            $date = Carbon::parse($request->date);
            $duration = $request->get('duration', 45); // domyślnie 45 minut

            $existingLessons = Lesson::forTeacher($teacherId)
                ->whereDate('start_time', $date)
                ->where('status', '!=', 'cancelled')
                ->select('start_time', 'end_time')
                ->get();

            $availableSlots = [];
            $startHour = 9;
            $endHour = 17;
            
            for ($hour = $startHour; $hour < $endHour; $hour++) {
                for ($minute = 0; $minute < 60; $minute += 30) {
                    $slotStart = $date->copy()->setTime($hour, $minute);
                    $slotEnd = $slotStart->copy()->addMinutes($duration);

                    $isAvailable = true;
                    foreach ($existingLessons as $lesson) {
                        $lessonStart = Carbon::parse($lesson->start_time);
                        $lessonEnd = Carbon::parse($lesson->end_time);

                        if (($slotStart >= $lessonStart && $slotStart < $lessonEnd) ||
                            ($slotEnd > $lessonStart && $slotEnd <= $lessonEnd) ||
                            ($slotStart <= $lessonStart && $slotEnd >= $lessonEnd)) {
                            $isAvailable = false;
                            break;
                        }
                    }

                    if ($slotEnd->hour >= $endHour) {
                        $isAvailable = false;
                    }

                    $availableSlots[] = [
                        'start_time' => $slotStart->format('H:i'),
                        'end_time' => $slotEnd->format('H:i'),
                        'is_available' => $isAvailable,
                        'duration' => $duration
                    ];
                }
            }

            return response()->json([
                'available_slots' => $availableSlots,
                'date' => $date->toDateString(),
                'teacher' => [
                    'id' => $teacher->id,
                    'name' => $teacher->name
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Get available slots error: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Internal server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}