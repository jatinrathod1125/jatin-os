<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'value', 'public'])]
class Setting extends Model
{
    protected function casts(): array
    {
        return ['public' => 'boolean'];
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('public', true);
    }
}
