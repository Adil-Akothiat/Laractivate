<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // Re-maps Laravel's database 'data' object directly into your 'details' schema
            'details' => [
                'title' => $this->data['title'] ?? '',
                'message' => $this->data['message'] ?? '',
                'action' => $this->data['action'] ?? '',
                'type' => $this->data['type'] ?? 'info',
                'icon' => $this->data['icon'] ?? '',
            ],
            // Standardizes snake_case to frontend camelCase
            'readAt' => $this->read_at ? $this->read_at->toISOString() : null,
            'createdAt' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
