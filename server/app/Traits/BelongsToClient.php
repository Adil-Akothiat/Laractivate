<?php

namespace App\Traits;

use App\Models\Scopes\ClientScope;
use Illuminate\Database\Eloquent\Model;

trait BelongsToClient
{
    protected static function bootBelongsToClient(): void
    {
        static::addGlobalScope(new ClientScope());

        static::creating(function (Model $model) {
            if (! $model->client_id && session()->has('current_client_id')) {
                $model->client_id = session('current_client_id');
            }
        });
    }

    public function client()
    {
        return $this->belongsTo(\App\Models\Client::class);
    }
}