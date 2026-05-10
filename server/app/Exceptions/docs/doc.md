# ⚠️ API Exception & Error Handling

This directory manages the translation of internal system errors and business logic violations into standardized JSON responses for the frontend.

## 🏛️ The Centralized Handler Pattern

We use a **Global Interception** strategy. Instead of wrapping every controller method in `try-catch` blocks, we allow exceptions to "bubble up" to `bootstrap/app.php`, which delegates formatting to the `ApiExceptionHandler` class.

### 🔄 Error Lifecycle
1. **Trigger:** A Service throws an Exception (e.g., `ValidationException`).
2. **Capture:** The Laravel Exception Handler catches the event.
3. **Filter:** The handler checks if the request is an `api/*` route.
4. **Format:** `ApiExceptionHandler` converts the PHP object into a clean JSON payload.

---

## 📋 Standard Response Schema

All error responses follow this strict structure to ensure the React frontend can parse them predictably:

```json
{
    "code": "ERROR_SLUG",
    "message": "Human readable description",
    "errors": [] 
}