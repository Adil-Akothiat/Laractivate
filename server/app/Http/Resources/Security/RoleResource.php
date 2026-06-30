<?php

namespace App\Http\Resources\Security;

use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;

class RoleResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}