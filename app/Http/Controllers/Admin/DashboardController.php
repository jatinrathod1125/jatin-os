<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiChat;
use App\Models\Message;
use App\Models\Project;
use App\Models\Skill;
use App\Models\VisitorLog;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'visitors' => VisitorLog::query()->count(),
                'visitorsToday' => VisitorLog::query()->whereDate('visited_at', today())->count(),
                'messages' => Message::query()->count(),
                'chatPrompts' => AiChat::query()->count(),
            ],
            'projects' => Project::query()->orderBy('sort_order')->get(),
            'skills' => Skill::query()->orderBy('sort_order')->get(),
            'messages' => Message::query()->latest()->limit(8)->get(),
            'chats' => AiChat::query()->latest()->limit(8)->get(),
        ]);
    }
}
