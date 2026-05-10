<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Get the user ID from the route (works for /users/{user})
        $userId = $this->route('id'); 
        // Determine if we are updating
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'first_name' => [
                $isUpdate ? 'sometimes' : 'required', 
                'string', 
                'max:32'
            ],
            'last_name'  => [
                $isUpdate ? 'sometimes' : 'required', 
                'string', 
                'max:32'
            ],
            'email'      => [
                $isUpdate ? 'sometimes' : 'required', 
                'string', 
                'email', 
                'max:191',
                // Ignore the current user ID during update
                $isUpdate ? 'unique:users,email,' . $userId : 'unique:users,email'
            ],
            'password'   => [
                $isUpdate ? 'nullable' : 'required', 
                'string', 
                'min:8', 
                'confirmed'
            ],
            'is_active'  => [
                'sometimes', 
                'boolean'
            ],
            'roles'      => [
                'nullable', 
                'array'
            ],
            'roles.*'    => [
                'string', 
                'exists:roles,id'
            ],
        ];
    }
}
