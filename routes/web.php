<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\NoteListController;
use App\Http\Controllers\AuthSocial\GoogleController;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {return Inertia::render('dashboard');})->name('dashboard');
    Route::get('summerize', function () {return Inertia::render('summerize');})->name('summerize');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/notes/list', [NoteListController::class, 'index']);
    Route::post('/notes/save', [NoteListController::class, 'save']);
    Route::delete('/notes/{id}', [NoteListController::class, 'destroy']);
    Route::post('/notes/summarize', [NoteListController::class, 'summarize']);
});

Route::get('/auth/redirect', [GoogleController::class, 'googlepage'])->name('google_login');
Route::get('/auth/callback',[GoogleController::class, 'googleCallback']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
