<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class BasePaginatedCollection extends ResourceCollection
{
    /**
     * This method overrides the default Laravel pagination structure.
     * It ensures the 'links' and 'meta' keys match your TS interfaces exactly.
    */
    /**
    * @param \Illuminate\Http\Request $request
    * @param mixed $_paginated  <-- Ignored because it's an array
    * @param array $default
    */
    public function paginationInformation(Request $request, $_paginated, $default): array
    {
        $resource = $this->resource;
        if (!$resource instanceof LengthAwarePaginator) {
            return [];
        }
        // Cast to LengthAwarePaginator to get IDE autocomplete
        
        return [
            'links' => [
                'first' => $resource->url(1),
                'last'  => $resource->url($resource->lastPage()),
                'prev'  => $resource->previousPageUrl(),
                'next'  => $resource->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $resource->currentPage(),
                'from'         => $resource->firstItem(),
                'last_page'    => $resource->lastPage(),
                'path'         => $resource->path(),
                'per_page'     => $resource->perPage(),
                'to'           => $resource->lastItem(),
                'total'        => $resource->total(),
            ],
        ];
    }
}