<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['session_id', 'prompt', 'response', 'provider', 'model', 'successful'])]
class AiChat extends Model
{
    protected function casts(): array
    {
        return ['successful' => 'boolean'];
    }
}
