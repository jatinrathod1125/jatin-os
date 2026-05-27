<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        Project::create($this->validated($request));

        return back()->with('success', 'Project added to the desktop.');
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $project->update($this->validated($request, $project));

        return back()->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return back()->with('success', 'Project removed.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Project $project = null): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'alpha_dash', 'max:140', Rule::unique('projects')->ignore($project)],
            'tagline' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string', 'max:2000'],
            'tech_stack' => ['nullable', 'string', 'max:500'],
            'repository_url' => ['nullable', 'url', 'max:255'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'accent' => ['required', Rule::in(['cyan', 'violet', 'emerald', 'amber'])],
            'sort_order' => ['required', 'integer', 'min:0', 'max:999'],
        ]);

        return [
            ...$validated,
            'tech_stack' => collect(explode(',', $validated['tech_stack'] ?? ''))
                ->map(fn (string $item) => trim($item))
                ->filter()
                ->values()
                ->all(),
            'featured' => $request->boolean('featured'),
            'published' => $request->boolean('published'),
        ];
    }
}
