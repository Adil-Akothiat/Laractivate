<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use App\Http\Resources\System\BasePaginatedCollection;

class SubscriptionCollection extends BasePaginatedCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data'=> SubscriptionResource::collection($this->collection)
        ];
    }
}
