<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;
use App\Models\User;
use Carbon\Carbon;

class LessonsSeeder extends Seeder
{
    public function run()
    {
        $teacher = User::where('role', 'teacher')->first();
        $student = User::where('role', 'student')->first();

        if (!$teacher || !$student) {
            return;
        }

        $startOfWeek = now()->startOfWeek();
        
        $lessons = [
            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - podstawy',
                'description' => 'Praca nad techniką oddychania i podstawami śpiewu',
                'start_time' => $startOfWeek->copy()->addDay()->setTime(10, 0),
                'end_time' => $startOfWeek->copy()->addDay()->setTime(10, 45),
                'status' => 'scheduled',
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - interpretacja',
                'description' => 'Praca nad interpretacją utworów',
                'start_time' => $startOfWeek->copy()->addDays(3)->setTime(14, 0),
                'end_time' => $startOfWeek->copy()->addDays(3)->setTime(14, 45),
                'status' => 'scheduled',
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - dzisiaj',
                'description' => 'Dzisiejsza lekcja wokalu',
                'start_time' => now()->setTime(16, 0),
                'end_time' => now()->setTime(16, 45),
                'status' => 'scheduled',
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            // Zakończona lekcja
            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - zakończona',
                'description' => 'Zakończona lekcja z poprzedniego tygodnia',
                'start_time' => now()->subWeek()->setTime(10, 0),
                'end_time' => now()->subWeek()->setTime(10, 45),
                'status' => 'completed',
                'instrument' => 'Wokal',
                'notes' => 'Student zrobił duże postępy w technice oddychania',
                'price' => 120.00,
                'is_paid' => true,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
        ];

        foreach ($lessons as $lessonData) {
            Lesson::create($lessonData);
        }
    }
}