<?php

namespace App\Http\Resources\Security;

use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;

class PermissionResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'name'      => $this->name,
            'group'     => $this->group,
            'is_locked' => $this->is_locked,
        ];
    }
}
