<?php

namespace App\Services\Auth;

use PragmaRX\Google2FA\Google2FA;

class IdentityService
{
    public function __construct(
        protected Google2FA $google2fa
    ){}

    public function generateSecretKey()
    {
        return $this->google2fa->generateSecretKey();
    }

    public function getQRCodeUrl($companyName, $userEmail, $secret)
    {
        return $this->google2fa->getQRCodeUrl($companyName, $userEmail, $secret);
    }

    public function verifyKey($secret, $code)
    {
        return $this->google2fa->verifyKey($secret, $code);
    }

}