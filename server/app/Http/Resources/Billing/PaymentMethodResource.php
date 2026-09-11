<?php

namespace App\Http\Resources\Billing;

use Illuminate\Http\Request;
use App\Http\Resources\System\BaseResource;

class PaymentMethodResource extends BaseResource
{
    protected mixed $defaultPaymentMethod;
    public function __construct($resource, $defaultPaymentMethod=null) {
        parent::__construct($resource);
        $this->defaultPaymentMethod = $defaultPaymentMethod;
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->card->brand,        // visa, mastercard, etc.
            'last4' => $this->card->last4,          // 4242
            'exp_month' => $this->card->exp_month,
            'exp_year' => $this->card->exp_year,
            'is_default' => $this->defaultPaymentMethod && $this->id === $this->defaultPaymentMethod->id
        ];
    }
}