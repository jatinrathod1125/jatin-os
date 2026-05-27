<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->filled('website')) {
            return response()->json(['message' => 'Transmission received. I will reply soon.'], 201);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        Message::create([
            ...$validated,
            'ip_hash' => $request->ip()
                ? hash_hmac('sha256', $request->ip(), (string) config('app.key'))
                : null,
        ]);

        return response()->json(['message' => 'Transmission received. I will reply soon.'], 201);
    }
}
