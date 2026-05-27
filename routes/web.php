<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/', PortfolioController::class)->name('home');
Route::post('contact', ContactMessageController::class)
    ->middleware('throttle:5,1')
    ->name('contact.store');
Route::post('assistant/chat', AssistantController::class)
    ->middleware('throttle:20,1')
    ->name('assistant.chat');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('can:access-admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');
        Route::post('projects', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::put('projects/{project}', [AdminProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [AdminProjectController::class, 'destroy'])->name('projects.destroy');
        Route::post('skills', [AdminSkillController::class, 'store'])->name('skills.store');
        Route::put('skills/{skill}', [AdminSkillController::class, 'update'])->name('skills.update');
        Route::delete('skills/{skill}', [AdminSkillController::class, 'destroy'])->name('skills.destroy');
    });
});

require __DIR__.'/settings.php';
