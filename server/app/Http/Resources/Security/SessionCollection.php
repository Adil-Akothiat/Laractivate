<?php

namespace App\Http\Resources\Security;

use Illuminate\Http\Request;
use App\Http\Resources\System\BasePaginatedCollection;

class SessionCollection extends BasePaginatedCollection
{
    /**
     * Explicitly define the resource that this collection collects.
     * This stops Laravel from trying to call mapInto() on the model.
     */
    public $collects = SessionResource::class;

    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        // Now $this->collection contains SessionResource instances automatically
        // We just need to resolve them to arrays to partition them
        $transformedItems = $this->collection->map(function ($resource) use ($request) {
            return $resource->toArray($request);
        });

        // 2. Use Laravel Collection to partition the data
        $partitioned = $transformedItems->partition(function ($session) {
            return ($session['is_active'] ?? false) === true;
        });

        return [
            'data' => [
                'active'  => $partitioned[0]->sortByDesc('is_current')->values()->all(),
                'history' => $partitioned[1]->values()->all(),
            ]
        ];
    }
}