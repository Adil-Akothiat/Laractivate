<?php

namespace App\Exceptions;

use DomainException;

class BusinessRuleException extends DomainException
{
    public function __construct(
        string $message,
        public readonly int $status = 422,
        public readonly string $code = ""
    ) {
        parent::__construct($message);
    }

}