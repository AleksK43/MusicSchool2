<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->enum('status', [
                'pending',
                'scheduled',
                'pending_student_approval',
                'completed',
                'cancelled',
                'no_show'
            ])->default('pending');
            $table->string('instrument')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('price', 8, 2)->nullable();
            $table->boolean('is_paid')->default(false);
            $table->enum('lesson_type', ['individual', 'group'])->default('individual');
            $table->string('location')->nullable();
            $table->timestamps();

            $table->index(['teacher_id', 'start_time']);
            $table->index(['student_id', 'start_time']);
            $table->index('start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
