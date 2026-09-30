<?php

namespace App\Http\Resources\User;

use App\Http\Resources\System\BasePaginatedCollection;
use Illuminate\Http\Request;

class MemberCollection extends BasePaginatedCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data'=> MemberResource::collection($this->collection)
        ];
    }
}
