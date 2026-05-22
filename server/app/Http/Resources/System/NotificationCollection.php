<?php

namespace App\Http\Resources\System;

use Illuminate\Http\Request;

class NotificationCollection extends BaseResource
{
    /**
     * @param mixed $resource The raw notifications collection/paginator
     * @param int $unreadCount Preserved unread metric integer
     */
    public function __construct($resource, protected int $unreadCount)
    {
        // 1. Process individual records through the NotificationResource map
        $transformedCollection = NotificationResource::collection($resource);

        // 2. Pass the unified dictionary payload up into the BaseResource constructor
        parent::__construct([
            'notifications' => $transformedCollection,
            'unreadCount'   => $this->unreadCount,
        ]);
    }
}