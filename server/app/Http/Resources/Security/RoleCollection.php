<?php

namespace App\Http\Resources\Security;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
// use App\Http\Resources\System\BasePaginatedCollection;

class RoleCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data'=> RoleResource::collection($this->collection)
        ];
    }
}
