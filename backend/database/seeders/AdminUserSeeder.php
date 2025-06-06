<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@artyz.pl',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Przykładowy nauczyciel
        User::create([
            'name' => 'Anna Kowalska',
            'email' => 'anna@artyz.pl',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher',
            'instrument' => 'Wokal',
            'is_active' => true,
        ]);

        // Przykładowy student
        User::create([
            'name' => 'Maria Nowak',
            'email' => 'maria@artyz.pl',
            'password' => Hash::make('student123'),
            'role' => 'student',
            'instrument' => 'Gitara',
            'is_active' => true,
        ]);
    }
}