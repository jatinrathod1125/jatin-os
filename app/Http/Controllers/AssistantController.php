<?php

namespace App\Http\Controllers;

use App\Models\AiChat;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Skill;
use Illuminate\Http\Client\Response as HttpResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class AssistantController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => ['required', 'string', 'min:2', 'max:1000'],
        ]);

        $prompt = $validated['prompt'];
        $answer = $this->openAiAnswer($prompt) ?? [
            'text' => $this->localAnswer($prompt),
            'provider' => 'local',
            'model' => null,
        ];

        AiChat::create([
            'session_id' => $request->session()->getId(),
            'prompt' => $prompt,
            'response' => $answer['text'],
            'provider' => $answer['provider'],
            'model' => $answer['model'],
            'successful' => true,
        ]);

        return response()->json([
            'answer' => $answer['text'],
            'provider' => $answer['provider'],
        ]);
    }

    /**
     * @return array{text: string, provider: string, model: string}|null
     */
    private function openAiAnswer(string $prompt): ?array
    {
        $key = config('services.openai.key');
        $model = (string) config('services.openai.model');

        if (! $key) {
            return null;
        }

        try {
            $response = Http::withToken($key)
                ->acceptJson()
                ->timeout(25)
                ->post('https://api.openai.com/v1/responses', [
                    'model' => $model,
                    'store' => false,
                    'max_output_tokens' => 420,
                    'instructions' => $this->assistantContext(),
                    'input' => $prompt,
                ]);

            if (! $response->successful()) {
                return null;
            }

            $text = $this->extractText($response);

            return $text ? [
                'text' => $text,
                'provider' => 'openai',
                'model' => $model,
            ] : null;
        } catch (Throwable) {
            return null;
        }
    }

    private function extractText(HttpResponse $response): ?string
    {
        foreach ($response->json('output', []) as $item) {
            foreach ($item['content'] ?? [] as $content) {
                if (($content['type'] ?? null) === 'output_text' && filled($content['text'] ?? null)) {
                    return trim($content['text']);
                }
            }
        }

        return null;
    }

    private function assistantContext(): string
    {
        $profile = Setting::public()->pluck('value', 'key');
        $projects = Project::published()->orderBy('sort_order')->pluck('tagline', 'title');
        $skills = Skill::visible()->orderBy('sort_order')->pluck('name')->join(', ');

        return implode("\n", [
            'You are ORBIT, the concise AI guide inside a developer portfolio.',
            'Only discuss the developer, listed work, stack, hiring fit, or reasonable software engineering questions.',
            'Be warm and professional. Never invent employment history, metrics, links, or project outcomes.',
            'Developer: '.($profile['owner_name'] ?? 'Jatin').' - '.($profile['role'] ?? 'Laravel developer').'.',
            'Bio: '.($profile['intro'] ?? 'Builds thoughtful web products.'),
            'Projects: '.$projects->map(fn ($tagline, $title) => $title.': '.$tagline)->join(' | '),
            'Skills: '.$skills,
        ]);
    }

    private function localAnswer(string $prompt): string
    {
        $question = Str::lower($prompt);
        $owner = Setting::public()->where('key', 'owner_name')->value('value') ?? 'Jatin';

        if (Str::contains($question, ['project', 'built', 'portfolio'])) {
            $projects = Project::published()->orderBy('sort_order')->limit(3)->get();

            return 'Explore '.$projects->map(fn (Project $project) => $project->title.' ('.$project->tagline.')')->join(', ').
                '. Open Projects for architecture notes and stack details.';
        }

        if (Str::contains($question, ['laravel', 'architecture', 'backend'])) {
            return $owner.' builds Laravel applications with controllers and validation at the HTTP boundary, Eloquent-backed domain data, Inertia/React interfaces, and testable authorization rules.';
        }

        if (Str::contains($question, ['skill', 'stack', 'technology', 'tech'])) {
            $skills = Skill::visible()->orderByDesc('level')->limit(6)->pluck('name')->join(', ');

            return 'The current focus stack is '.$skills.'. Open the About window to see proficiency grouped by discipline.';
        }

        if (Str::contains($question, ['hire', 'contact', 'available', 'email'])) {
            return $owner.' is open to meaningful product work. Use the Contact app to send a direct message and include the role, product and timeline.';
        }

        return 'I can answer questions about '.$owner."'s projects, Laravel architecture, technical skills, or availability. Try asking which project best demonstrates backend engineering.";
    }
}
