<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'student_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'status',
        'instrument',
        'notes',
        'price',
        'is_paid',
        'lesson_type',
        'location',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'price' => 'decimal:2',
        'is_paid' => 'boolean',
    ];

    // Dostępne statusy
    const STATUS_PENDING = 'pending'; // Oczekuje na potwierdzenie nauczyciela
    const STATUS_SCHEDULED = 'scheduled'; // Zatwierdzona
    const STATUS_PENDING_STUDENT_APPROVAL = 'pending_student_approval'; // Nauczyciel zaproponował zmianę
    const STATUS_COMPLETED = 'completed'; // Zakończona
    const STATUS_CANCELLED = 'cancelled'; // Anulowana
    const STATUS_NO_SHOW = 'no_show'; // Nieobecność

    // Relacje
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // Scopes
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_time', [$startDate, $endDate]);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())
                    ->whereIn('status', [self::STATUS_SCHEDULED, self::STATUS_PENDING, self::STATUS_PENDING_STUDENT_APPROVAL]);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('start_time', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('start_time', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopePendingStudentApproval($query)
    {
        return $query->where('status', self::STATUS_PENDING_STUDENT_APPROVAL);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED);
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    // Helper methods
    public function getDurationAttribute()
    {
        return $this->start_time->diffInMinutes($this->end_time);
    }

    public function getIsUpcomingAttribute()
    {
        return $this->start_time > now() && in_array($this->status, [
            self::STATUS_SCHEDULED, 
            self::STATUS_PENDING, 
            self::STATUS_PENDING_STUDENT_APPROVAL
        ]);
    }

    public function getIsTodayAttribute()
    {
        return $this->start_time->isToday();
    }

    public function getFormattedDateAttribute()
    {
        return $this->start_time->format('d.m.Y');
    }

    public function getFormattedTimeAttribute()
    {
        return $this->start_time->format('H:i') . ' - ' . $this->end_time->format('H:i');
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            self::STATUS_PENDING => 'yellow',
            self::STATUS_SCHEDULED => 'blue',
            self::STATUS_PENDING_STUDENT_APPROVAL => 'orange',
            self::STATUS_COMPLETED => 'green',
            self::STATUS_CANCELLED => 'red',
            self::STATUS_NO_SHOW => 'orange',
            default => 'gray'
        };
    }

    public function getStatusTextAttribute()
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Oczekuje na potwierdzenie',
            self::STATUS_SCHEDULED => 'Zaplanowana',
            self::STATUS_PENDING_STUDENT_APPROVAL => 'Oczekuje na akceptację studenta',
            self::STATUS_COMPLETED => 'Zakończona',
            self::STATUS_CANCELLED => 'Anulowana',
            self::STATUS_NO_SHOW => 'Nieobecność',
            default => 'Nieznany'
        };
    }

    public function getCanBeCancelledAttribute()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_SCHEDULED, self::STATUS_PENDING_STUDENT_APPROVAL]) 
               && $this->start_time > now()->addHours(24);
    }

    public function getCanBeApprovedAttribute()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function getCanBeRescheduledAttribute()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_SCHEDULED]) 
               && $this->start_time > now();
    }

    public function getCanBeCompletedAttribute()
    {
        return $this->status === self::STATUS_SCHEDULED 
               && $this->start_time <= now() 
               && $this->end_time >= now()->subHours(2); // Można oznaczyć jako zakończoną do 2h po
    }

    // Metody biznesowe
    public function approve()
    {
        if ($this->status !== self::STATUS_PENDING) {
            throw new \Exception('Tylko lekcje oczekujące mogą być zatwierdzone.');
        }

        $this->update(['status' => self::STATUS_SCHEDULED]);
        return $this;
    }

    public function reject($reason = null)
    {
        if ($this->status !== self::STATUS_PENDING) {
            throw new \Exception('Tylko lekcje oczekujące mogą być odrzucone.');
        }

        $this->update([
            'status' => self::STATUS_CANCELLED,
            'notes' => $reason ? "Odrzucona: {$reason}" : 'Odrzucona przez nauczyciela'
        ]);
        return $this;
    }

    public function complete($notes = null)
    {
        if ($this->status !== self::STATUS_SCHEDULED) {
            throw new \Exception('Tylko zaplanowane lekcje mogą być oznaczone jako zakończone.');
        }

        $updateData = ['status' => self::STATUS_COMPLETED];
        if ($notes) {
            $updateData['notes'] = $notes;
        }

        $this->update($updateData);
        return $this;
    }

    public function markAsNoShow($notes = null)
    {
        if ($this->status !== self::STATUS_SCHEDULED) {
            throw new \Exception('Tylko zaplanowane lekcje mogą być oznaczone jako nieobecność.');
        }

        $updateData = ['status' => self::STATUS_NO_SHOW];
        if ($notes) {
            $updateData['notes'] = $notes;
        }

        $this->update($updateData);
        return $this;
    }

    public function cancel($reason = null)
    {
        if (!$this->can_be_cancelled) {
            throw new \Exception('Ta lekcja nie może być anulowana.');
        }

        $updateData = ['status' => self::STATUS_CANCELLED];
        if ($reason) {
            $updateData['notes'] = "Anulowana: {$reason}";
        }

        $this->update($updateData);
        return $this;
    }

    public function reschedule($newStartTime, $newEndTime, $reason = null)
    {
        if (!$this->can_be_rescheduled) {
            throw new \Exception('Ta lekcja nie może być przełożona.');
        }

        $updateData = [
            'start_time' => $newStartTime,
            'end_time' => $newEndTime,
        ];

        // Jeśli zmiana jest inicjowana przez nauczyciela, wymaga akceptacji studenta
        if ($this->status === self::STATUS_SCHEDULED) {
            $updateData['status'] = self::STATUS_PENDING_STUDENT_APPROVAL;
        }

        if ($reason) {
            $updateData['notes'] = "Przełożona: {$reason}";
        }

        $this->update($updateData);
        return $this;
    }

    public function approveReschedule()
    {
        if ($this->status !== self::STATUS_PENDING_STUDENT_APPROVAL) {
            throw new \Exception('Brak oczekującej zmiany terminu do zatwierdzenia.');
        }

        $this->update(['status' => self::STATUS_SCHEDULED]);
        return $this;
    }

    public function rejectReschedule($reason = null)
    {
        if ($this->status !== self::STATUS_PENDING_STUDENT_APPROVAL) {
            throw new \Exception('Brak oczekującej zmiany terminu do odrzucenia.');
        }

        // Przywróć poprzedni status lub anuluj
        $this->update([
            'status' => self::STATUS_CANCELLED,
            'notes' => $reason ? "Odrzucona zmiana terminu: {$reason}" : 'Student odrzucił zmianę terminu'
        ]);
        return $this;
    }

    // Sprawdzenie konfliktów czasowych
    public static function hasConflict($teacherId, $studentId, $startTime, $endTime, $excludeId = null)
    {
        $query = self::where(function($q) use ($teacherId, $studentId) {
            $q->where('teacher_id', $teacherId)
              ->orWhere('student_id', $studentId);
        })
        ->where('status', '!=', self::STATUS_CANCELLED)
        ->where(function($query) use ($startTime, $endTime) {
            $query->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function($q) use ($startTime, $endTime) {
                      $q->where('start_time', '<=', $startTime)
                        ->where('end_time', '>=', $endTime);
                  });
        });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}