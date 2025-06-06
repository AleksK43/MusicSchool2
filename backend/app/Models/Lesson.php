<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Lesson extends Model
{
    use HasFactory;

    // Stałe statusów
    const STATUS_PENDING = 'pending';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_PENDING_STUDENT_APPROVAL = 'pending_student_approval';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_NO_SHOW = 'no_show';
    const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'teacher_id',
        'student_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'status',
        'instrument',
        'price',
        'is_paid',
        'lesson_type',
        'location',
        'notes'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'is_paid' => 'boolean',
        'price' => 'decimal:2'
    ];

    // Relacje
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Scope'y używane w kontrolerach
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('start_time', now()->toDateString());
    }

    public function scopeThisWeek($query)
    {
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();
        return $query->whereBetween('start_time', [$startOfWeek, $endOfWeek]);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())
                    ->where('status', '!=', self::STATUS_CANCELLED);
    }

    public function scopeInMonth($query, $year, $month)
    {
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();
        
        return $query->whereBetween('start_time', [$startDate, $endDate]);
    }

    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_time', [$startDate, $endDate]);
    }

    // Dodane dla lepszej wydajności
    public function scopeWithBasicRelations($query)
    {
        return $query->with([
            'teacher' => function($q) {
                $q->select('id', 'name', 'email', 'instrument');
            },
            'student' => function($q) {
                $q->select('id', 'name', 'email');
            }
        ]);
    }
}