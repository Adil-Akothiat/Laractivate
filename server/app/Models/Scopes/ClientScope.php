<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ClientScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (session()->has('current_client_id')) {
            $builder->where($model->getTable() . '.client_id', session('current_client_id'));
        }
    }
}