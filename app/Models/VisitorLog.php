<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['session_id', 'ip_hash', 'path', 'referrer', 'user_agent', 'visited_at'])]
class VisitorLog extends Model
{
    protected function casts(): array
    {
        return ['visited_at' => 'datetime'];
    }
}
