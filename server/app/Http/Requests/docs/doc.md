# Requests (Validation)

## Purpose
The security gate. Ensures all incoming data is clean, correctly typed, and authorized before reaching the Controller.

## Include
- **Validation Rules** — Defining field constraints (e.g., `email`, `exists`, `min:8`).
- **Authorization Logic** — Checking if the user has permission to perform the action via the `authorize()` method.
- **Custom Attributes** — Friendly field naming for human-readable error messages.

## Do NOT Include
- **Business Logic** — No calculations or conditional processing based on data values.
- **Database Persistence** — Do not save or update models inside a Request class.

## Directory Structure

```
Requests/
├─ ForgotPasswordRequest.php
├─ LoginRequest.php
├─ RegisterRequest.php
├─ ResetPasswordRequest.php
├─ RoleRequest.php
├─ StoreUserRequest.php
└─ docs/
   ├─ doc.md
   └─ requests.md
```

## Docker Commands

```bash
# Create a new form request
docker-compose exec app php artisan make:request LoginRequest
docker-compose exec app php artisan make:request Auth/ForgotPasswordRequest

# Requests can be namespaced into subfolders
docker-compose exec app php artisan make:request User/StoreUserRequest
```

> Every generated request has two methods to fill in:
>
> ```php
> public function authorize(): bool
> {
>     return true; // or check a policy/permission
> }
>
> public function rules(): array
> {
>     return [
>         'email'    => ['required', 'email', 'exists:users,email'],
>         'password' => ['required', 'string', 'min:8'],
>     ];
> }
> ```

## Further Reading
- [Requests Implementation Guide](./requests.md)