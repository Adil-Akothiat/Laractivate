<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    protected $message =  null;
    protected $extraMeta = [];
    
    /**
     * Fluent setter for the message
     */
    public function withMessage(string $message): self
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Fluent setter for extra meta
     */
    public function withMeta(array $meta): self
    {
        $this->extraMeta = $meta;
        return $this;
    }

    /**
     * Merge the message and meta into the top-level JSON
     */
    public function with($request): array
    {
        return [
            'message' => $this->message ?? '',
            'meta' => $this->extraMeta ?? [],
        ];
    }
}
