<?php return array (
  'Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider' => 
  array (
    'Illuminate\\Auth\\Events\\PasswordReset' => 
    array (
      0 => 'App\\Listeners\\LogResetPassword@handle',
    ),
    'Illuminate\\Auth\\Events\\Login' => 
    array (
      0 => 'App\\Listeners\\LogSuccessfulLogin@handle',
    ),
    'Laravel\\Cashier\\Events\\WebhookReceived' => 
    array (
      0 => 'App\\Listeners\\StripeEventListener@handle',
    ),
    'Illuminate\\Auth\\Events\\Logout' => 
    array (
      0 => 'App\\Listeners\\LogSuccessfulLogout@handle',
    ),
  ),
);