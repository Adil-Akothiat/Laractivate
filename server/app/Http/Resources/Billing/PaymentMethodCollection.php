<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use App\Http\Resources\System\BasePaginatedCollection;

class PaymentMethodCollection extends BasePaginatedCollection
{
    protected mixed $defaultPaymentMethod;
    public function __construct($resource, $defaultPaymentMethod=null) {
        parent::__construct($resource);
        $this->defaultPaymentMethod = $defaultPaymentMethod;
    }
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $reques): array
    {
        return [
            'data' => $this->collection->map(function ($paymentMethod) {
                return new PaymentMethodResource($paymentMethod, $this->defaultPaymentMethod);
            })->all(),
        ];
    }
}