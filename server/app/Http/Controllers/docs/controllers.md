# Controllers

### Standard Implementation Pattern
Controllers in **AuthPanel** follow a strict pattern: **Inject → Delegate → Respond**

1. **Dependency Injection (Constructor)**
We use constructor injection to bring in the necessary services. This keeps the methods clean and the controller testable.

2. **Method Execution Flow**
- **Validate**: Use Type-hinted `FormRequests` to ensure data integrity before the method body even executes.
- **Contextualize**: Gather necessary metadata (IP, User-Agent) from the Request.
- **Delegate**: Pass validated data to a Service.
- **Respond**: Return a `JsonResponse`, often utilizing a `Resource` for data transformation.

### Example
```php
class AuthController extends Controller
{
    // 1. Inject the "Brain" (Service)
    public function __construct(
        protected AuthService $auth
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        // 2. Delegate logic to the Service
        $result = $this->auth->login($request->validated());

        // 3. Return a structured Response
        return response()->json([
            'user' => new UserResource($result['user']),
            'message' => 'Success'
        ], 200);
    }
}
```