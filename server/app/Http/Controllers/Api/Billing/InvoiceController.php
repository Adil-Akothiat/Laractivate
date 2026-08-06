<?php

namespace App\Http\Controllers\Api\Billing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Billing\InvoiceCollection;
use App\Models\User;
use App\Services\Billing\{ InvoiceService };

class InvoiceController extends Controller
{
    public function __construct(
        protected InvoiceService $invoiceService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $invoices = $this->invoiceService->getUserInvoices($request->user());   
        // Return wrapped resource collection safely
        return new InvoiceCollection($invoices);   
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new InvoiceCollection($this->invoiceService->getUserInvoices($user));   
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
