<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class BaseCollection extends ResourceCollection
{
    protected ?string $message = null;
    protected array $extraMeta = [];

    public function __construct($resource, ?string $collects = null)
    {
        if ($collects) {
            $this->collects = $collects;
        }

        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
        ];
    }

    public function withMessage(string $message): self
    {
        $this->message = $message;
        return $this;
    }

    public function withMeta(array $meta): self
    {
        $this->extraMeta = $meta;
        return $this;
    }

    public function with($request): array
    {
        return [
            'message' => $this->message ?? '',
            'meta' => $this->extraMeta ?? [],
        ];
    }
}
