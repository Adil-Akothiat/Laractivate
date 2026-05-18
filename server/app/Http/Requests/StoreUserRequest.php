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
        $userId = $this->route('user');

        return [
            'first_name' => 'required|string|max:32',
            'last_name'  => 'required|string|max:32',
            'email'      => 'required|email|max:191|unique:users,email,' . $userId,
            'password'   => 'nullable|string|min:8|confirmed',
            'is_active'  => 'sometimes|boolean',
            'rolesSet'   => 'nullable|array',
            'rolesSet.*' => 'string|exists:roles,id'
        ];
    }
}
