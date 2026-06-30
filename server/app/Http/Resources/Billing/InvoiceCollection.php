<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use App\Http\Resources\System\BasePaginatedCollection;

class InvoiceCollection extends BasePaginatedCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data'=> InvoiceResource::collection($this->collection)
        ];
    }
}
