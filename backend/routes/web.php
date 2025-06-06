<?php
// routes/web.php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Laravel API is running']);
});

Route::middleware(['web'])->group(function () {

});