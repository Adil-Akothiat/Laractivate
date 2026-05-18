<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
        $user = $this->route('user') ?? $this->user; 
        $userId = $user->id; // Get the ID for the unique rule ignore

        return [
            'first_name' => 'sometimes|string|max:32',
            'last_name'  => 'sometimes|string|max:32',
            'email'      => 'sometimes|email|max:191|unique:users,email,' . $userId,
            'password'   => 'nullable|string|min:8|confirmed',
            'is_active'  => 'sometimes|boolean'
        ];
    }
}
