<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Request;
use App\Http\Resources\System\BasePaginatedCollection;

class ActivityLogCollection extends BasePaginatedCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
    */
    public function toArray(Request $request): array
    {
        return [
            'data'=> ActivityLogResource::collection($this->collection)
        ];
    }
}
