<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\VisitorLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $alreadyRecorded = VisitorLog::query()
            ->where('session_id', $request->session()->getId())
            ->whereDate('visited_at', today())
            ->exists();

        if (! $alreadyRecorded) {
            VisitorLog::create([
                'session_id' => $request->session()->getId(),
                'ip_hash' => $this->hashIp($request->ip()),
                'path' => '/'.$request->path(),
                'referrer' => $request->header('referer'),
                'user_agent' => $request->userAgent(),
                'visited_at' => now(),
            ]);
        }

        return Inertia::render('portfolio/index', [
            'projects' => Project::published()
                ->orderByDesc('featured')
                ->orderBy('sort_order')
                ->get(),
            'skills' => Skill::visible()
                ->orderBy('sort_order')
                ->get(),
            'profile' => Setting::public()
                ->pluck('value', 'key'),
        ]);
    }

    private function hashIp(?string $ip): ?string
    {
        return $ip ? hash_hmac('sha256', $ip, (string) config('app.key')) : null;
    }
}
