<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        Skill::create($this->validated($request));

        return back()->with('success', 'Skill added.');
    }

    public function update(Request $request, Skill $skill): RedirectResponse
    {
        $skill->update($this->validated($request));

        return back()->with('success', 'Skill updated.');
    }

    public function destroy(Skill $skill): RedirectResponse
    {
        $skill->delete();

        return back()->with('success', 'Skill removed.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return [
            ...$request->validate([
                'name' => ['required', 'string', 'max:80'],
                'category' => ['required', 'string', 'max:80'],
                'level' => ['required', 'integer', 'min:1', 'max:100'],
                'summary' => ['nullable', 'string', 'max:200'],
                'sort_order' => ['required', 'integer', 'min:0', 'max:999'],
            ]),
            'visible' => $request->boolean('visible'),
        ];
    }
}
