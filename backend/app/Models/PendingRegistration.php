<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PendingRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'instrument',
        'experience',
        'role',
        'status',
        'approved_by',
        'admin_notes',
        'approved_at'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    // Relationships
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approve($adminId, $notes = null)
    {
        $user = User::create([
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password, 
            'phone' => $this->phone,
            'instrument' => $this->instrument,
            'experience' => $this->experience,
            'role' => $this->role,
            'is_active' => true,
        ]);

        $this->update([
            'status' => 'approved',
            'approved_by' => $adminId,
            'admin_notes' => $notes,
            'approved_at' => now(),
        ]);

        return $user;
    }

    public function reject($adminId, $reason)
    {
        $this->update([
            'status' => 'rejected',
            'approved_by' => $adminId,
            'admin_notes' => $reason,
            'approved_at' => now(),
        ]);
    }
}