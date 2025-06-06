<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;
use App\Models\User;
use Carbon\Carbon;

class EnhancedLessonsSeeder extends Seeder
{
    public function run()
    {
        $teacher = User::where('role', 'teacher')->first();
        $student = User::where('role', 'student')->first();

        if (!$teacher || !$student) {
            $this->command->warn('Brak nauczyciela lub studenta w bazie. Uruchom AdminUserSeeder najpierw.');
            return;
        }

        $teacher2 = User::create([
            'name' => 'Marcin Kowalski',
            'email' => 'marcin@artyz.pl',
            'password' => bcrypt('teacher123'),
            'role' => 'teacher',
            'instrument' => 'Gitara',
            'is_active' => true,
        ]);

        $student2 = User::create([
            'name' => 'Katarzyna Nowak',
            'email' => 'kasia@artyz.pl',
            'password' => bcrypt('student123'),
            'role' => 'student',
            'instrument' => 'Fortepian',
            'is_active' => true,
        ]);

        $now = now();
        $lessons = [
            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Prośba o lekcję wokalu',
                'description' => 'Chciałabym popracować nad techniką oddychania',
                'start_time' => $now->copy()->addDays(3)->setTime(14, 0),
                'end_time' => $now->copy()->addDays(3)->setTime(14, 45),
                'status' => Lesson::STATUS_PENDING,
                'instrument' => 'Wokal',
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            [
                'teacher_id' => $teacher2->id,
                'student_id' => $student2->id,
                'title' => 'Prośba o lekcję gitary',
                'description' => 'Początkująca, chciałabym zacząć od podstaw',
                'start_time' => $now->copy()->addDays(5)->setTime(16, 0),
                'end_time' => $now->copy()->addDays(5)->setTime(16, 45),
                'status' => Lesson::STATUS_PENDING,
                'instrument' => 'Gitara',
                'lesson_type' => 'individual',
                'location' => 'Sala 2',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - podstawy',
                'description' => 'Praca nad techniką oddychania i podstawami śpiewu',
                'start_time' => $now->copy()->addDays(1)->setTime(10, 0),
                'end_time' => $now->copy()->addDays(1)->setTime(10, 45),
                'status' => Lesson::STATUS_SCHEDULED,
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            [
                'teacher_id' => $teacher2->id,
                'student_id' => $student2->id,
                'title' => 'Lekcja fortepianu',
                'description' => 'Wprowadzenie do gamy C-dur',
                'start_time' => $now->copy()->addDays(2)->setTime(15, 0),
                'end_time' => $now->copy()->addDays(2)->setTime(15, 45),
                'status' => Lesson::STATUS_SCHEDULED,
                'instrument' => 'Fortepian',
                'price' => 130.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 3',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student2->id,
                'title' => 'Lekcja wokalu - dzisiaj',
                'description' => 'Praca nad interpretacją utworów',
                'start_time' => $now->copy()->setTime(17, 0),
                'end_time' => $now->copy()->setTime(17, 45),
                'status' => Lesson::STATUS_SCHEDULED,
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - zmiana terminu',
                'description' => 'Lekcja została przełożona przez nauczyciela',
                'start_time' => $now->copy()->addDays(4)->setTime(11, 0),
                'end_time' => $now->copy()->addDays(4)->setTime(11, 45),
                'status' => Lesson::STATUS_PENDING_STUDENT_APPROVAL,
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
                'notes' => 'Propozycja nauczyciela: Czy możemy przenieść na wcześniejszą godzinę?'
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - zakończona',
                'description' => 'Zakończona lekcja z poprzedniego tygodnia',
                'start_time' => $now->copy()->subWeek()->setTime(10, 0),
                'end_time' => $now->copy()->subWeek()->setTime(10, 45),
                'status' => Lesson::STATUS_COMPLETED,
                'instrument' => 'Wokal',
                'notes' => 'Student zrobił duże postępy w technice oddychania. Następnym razem skupimy się na interpretacji.',
                'price' => 120.00,
                'is_paid' => true,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            [
                'teacher_id' => $teacher2->id,
                'student_id' => $student2->id,
                'title' => 'Lekcja gitary - zakończona',
                'description' => 'Podstawowe akordy i riffy',
                'start_time' => $now->copy()->subDays(3)->setTime(14, 0),
                'end_time' => $now->copy()->subDays(3)->setTime(14, 45),
                'status' => Lesson::STATUS_COMPLETED,
                'instrument' => 'Gitara',
                'notes' => 'Świetny postęp w nauce akordów. Student opanował podstawowe pozycje.',
                'price' => 110.00,
                'is_paid' => false, 
                'lesson_type' => 'individual',
                'location' => 'Sala 2',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - anulowana',
                'description' => 'Lekcja anulowana przez studenta',
                'start_time' => $now->copy()->subDays(1)->setTime(16, 0),
                'end_time' => $now->copy()->subDays(1)->setTime(16, 45),
                'status' => Lesson::STATUS_CANCELLED,
                'instrument' => 'Wokal',
                'notes' => 'Anulowana: Student zachorował',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],

            [
                'teacher_id' => $teacher2->id,
                'student_id' => $student->id,
                'title' => 'Lekcja gitary - nieobecność',
                'description' => 'Student nie pojawił się na lekcji',
                'start_time' => $now->copy()->subDays(2)->setTime(13, 0),
                'end_time' => $now->copy()->subDays(2)->setTime(13, 45),
                'status' => Lesson::STATUS_NO_SHOW,
                'instrument' => 'Gitara',
                'notes' => 'Student nie pojawił się na lekcji i nie uprzedził o nieobecności',
                'price' => 110.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 2',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student2->id,
                'title' => 'Lekcja wokalu - interpretacja',
                'description' => 'Praca nad interpretacją ballad',
                'start_time' => $now->copy()->addWeek()->setTime(15, 0),
                'end_time' => $now->copy()->addWeek()->setTime(15, 45),
                'status' => Lesson::STATUS_SCHEDULED,
                'instrument' => 'Wokal',
                'price' => 120.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
            [
                'teacher_id' => $teacher2->id,
                'student_id' => $student->id,
                'title' => 'Lekcja gitary - riffy rockowe',
                'description' => 'Nauka podstawowych riffów rockowych',
                'start_time' => $now->copy()->addWeek()->addDay()->setTime(12, 0),
                'end_time' => $now->copy()->addWeek()->addDay()->setTime(12, 45),
                'status' => Lesson::STATUS_SCHEDULED,
                'instrument' => 'Gitara',
                'price' => 110.00,
                'lesson_type' => 'individual',
                'location' => 'Sala 2',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id, 
                'title' => 'Warsztat wokalny grupowy',
                'description' => 'Warsztat dla zaawansowanych wokalistek',
                'start_time' => $now->copy()->addDays(6)->setTime(18, 0),
                'end_time' => $now->copy()->addDays(6)->setTime(19, 30),
                'status' => Lesson::STATUS_SCHEDULED,
                'instrument' => 'Wokal',
                'price' => 80.00, 
                'lesson_type' => 'group',
                'location' => 'Sala główna',
            ],

            [
                'teacher_id' => $teacher2->id,
                'student_id' => $student2->id,
                'title' => 'Kolejna prośba o lekcję',
                'description' => 'Chciałabym kontynuować naukę akordów',
                'start_time' => $now->copy()->addDays(7)->setTime(10, 0),
                'end_time' => $now->copy()->addDays(7)->setTime(10, 45),
                'status' => Lesson::STATUS_PENDING,
                'instrument' => 'Gitara',
                'lesson_type' => 'individual',
                'location' => 'Sala 2',
            ],

            [
                'teacher_id' => $teacher->id,
                'student_id' => $student->id,
                'title' => 'Lekcja wokalu - miesięczna retrospektywa',
                'description' => 'Podsumowanie miesiąca nauki',
                'start_time' => $now->copy()->subMonth()->setTime(16, 0),
                'end_time' => $now->copy()->subMonth()->setTime(16, 45),
                'status' => Lesson::STATUS_COMPLETED,
                'instrument' => 'Wokal',
                'notes' => 'Doskonały postęp! Student jest gotowy na bardziej zaawansowane techniki.',
                'price' => 120.00,
                'is_paid' => true,
                'lesson_type' => 'individual',
                'location' => 'Sala 1',
            ],
        ];

        foreach ($lessons as $lessonData) {
            Lesson::create($lessonData);
        }

        $this->command->info('Utworzono ' . count($lessons) . ' przykładowych lekcji z różnymi statusami:');
        $this->command->info('- Pending: ' . collect($lessons)->where('status', Lesson::STATUS_PENDING)->count());
        $this->command->info('- Scheduled: ' . collect($lessons)->where('status', Lesson::STATUS_SCHEDULED)->count());
        $this->command->info('- Pending Student Approval: ' . collect($lessons)->where('status', Lesson::STATUS_PENDING_STUDENT_APPROVAL)->count());
        $this->command->info('- Completed: ' . collect($lessons)->where('status', Lesson::STATUS_COMPLETED)->count());
        $this->command->info('- Cancelled: ' . collect($lessons)->where('status', Lesson::STATUS_CANCELLED)->count());
        $this->command->info('- No Show: ' . collect($lessons)->where('status', Lesson::STATUS_NO_SHOW)->count());
    }
}