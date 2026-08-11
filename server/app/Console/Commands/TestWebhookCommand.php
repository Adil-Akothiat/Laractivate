$user = App\Models\User::where('email', 'admin@example.com')->first();
$paymentMethods = $user->paymentMethods('card');
    
    foreach ($paymentMethods as $paymentMethod) {
        try {
            $paymentMethod->delete(); // Cashier method
            // OR
            // $user->deletePaymentMethod($paymentMethod->id);
        } catch (\Exception $e) {
            \Log::error("Failed to delete payment method {$paymentMethod->id}: " . $e->getMessage());
        }
    }