<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        collect([
            'owner_name' => 'Jatin',
            'role' => 'Laravel Developer + AI Product Builder',
            'intro' => 'I design reliable Laravel products with expressive interfaces, thoughtful backend architecture, and practical AI features.',
            'availability' => 'Open to backend and full-stack product roles',
            'contact_email' => 'hello@jatin.dev',
            'location' => 'India / Remote',
        ])->each(fn (string $value, string $key) => Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'public' => true],
        ));

        collect([
            [
                'title' => 'Orbit OS Portfolio',
                'slug' => 'orbit-os-portfolio',
                'tagline' => 'An interview-ready desktop experience powered by Laravel and Inertia.',
                'description' => 'A portfolio explored like an operating system: boot animation, draggable applications, terminal commands, persisted analytics, contact intake and an AI guide.',
                'tech_stack' => ['Laravel 13', 'Inertia 3', 'React 19', 'Tailwind 4', 'OpenAI API'],
                'accent' => 'cyan',
                'featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Pulse Analytics Console',
                'slug' => 'pulse-analytics-console',
                'tagline' => 'A privacy-minded dashboard for visitor and interaction signals.',
                'description' => 'Aggregates visits, inbound messages and assistant usage into an admin-only interface, demonstrating authorization, Eloquent querying and product metrics.',
                'tech_stack' => ['Laravel', 'MySQL', 'Inertia', 'React'],
                'accent' => 'violet',
                'featured' => false,
                'sort_order' => 2,
            ],
            [
                'title' => 'Context AI Helpdesk',
                'slug' => 'context-ai-helpdesk',
                'tagline' => 'Portfolio-grounded answers with a dependable offline fallback.',
                'description' => 'Uses server-side AI calls with constrained portfolio context and stores conversation history for later review without exposing secret keys in the client.',
                'tech_stack' => ['Responses API', 'Laravel HTTP', 'Validation', 'React'],
                'accent' => 'emerald',
                'featured' => false,
                'sort_order' => 3,
            ],
        ])->each(fn (array $project) => Project::updateOrCreate(
            ['slug' => $project['slug']],
            [...$project, 'published' => true],
        ));

        collect([
            ['name' => 'Laravel', 'category' => 'Backend', 'level' => 93, 'summary' => 'APIs, queues, authorization and Eloquent architecture', 'sort_order' => 1],
            ['name' => 'PHP', 'category' => 'Backend', 'level' => 90, 'summary' => 'Modern typed application development', 'sort_order' => 2],
            ['name' => 'React + Inertia', 'category' => 'Frontend', 'level' => 88, 'summary' => 'SPA interactions with server-side routing', 'sort_order' => 3],
            ['name' => 'Tailwind CSS', 'category' => 'Frontend', 'level' => 86, 'summary' => 'Responsive product interfaces', 'sort_order' => 4],
            ['name' => 'MySQL', 'category' => 'Data', 'level' => 84, 'summary' => 'Schema design, indexing and reporting', 'sort_order' => 5],
            ['name' => 'AI Integration', 'category' => 'Product', 'level' => 82, 'summary' => 'Contextual assistants and safe fallbacks', 'sort_order' => 6],
        ])->each(fn (array $skill) => Skill::updateOrCreate(
            ['name' => $skill['name']],
            [...$skill, 'visible' => true],
        ));

        if (env('ADMIN_EMAIL') && env('ADMIN_PASSWORD')) {
            $admin = User::firstOrNew(['email' => env('ADMIN_EMAIL')]);
            $admin->forceFill([
                'name' => 'Jatin',
                'password' => Hash::make((string) env('ADMIN_PASSWORD')),
                'email_verified_at' => now(),
                'is_admin' => true,
            ])->save();
        }
    }
}
