# Requests Guide

## Standard Implementation Pattern
Requests in **AuthPanel** utilize Laravel's `FormRequest` to keep controllers clean and ensure validation is handled automatically by the framework.

1. **Authorization Gate**
The `authorize()` method is used for request-level permissions. If a user is not allowed to perform the action (e.g., a non-admin trying to update a Role), return `false`.

2. **Validation Rules**
The `rules()` method defines the constraints. We prioritize using array syntax for rules to maintain readability and prevent issues with piping characters.

### Example: `LoginRequest`

```php
class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Simple return true if no specific role check is needed here
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}
```

## Best Practices
- **Unique Checks**: When validating uniqueness (e.g., email), always ignore the current user ID during updates to avoid "email already taken" errors on self-profiles.
- **Error Messages**: Use the `messages()` method if a specific field requires a custom, user-friendly explanation beyond the Laravel default.
- **Automatic Injection**: Because we type-hint these in the Controller methods, Laravel automatically validates the data. If validation fails, an `Unprocessable Entity (422)` response is returned instantly via the `ApiExceptionHandler`.