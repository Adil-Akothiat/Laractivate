<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Request;

class ActivityLogResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
    */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'users_id'=> $this->users_id,
            'description'=> $this->description,
            'event'=> $this->event,
            'properties'=> $this->properties,
            'ip_address'=> $this->ip_address,
            'user_agent'=> $this->user_agent,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at
        ];
    }
}
