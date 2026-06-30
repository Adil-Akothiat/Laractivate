# 🔒 Authentication & JWT Lifecycle
This boilerplate implements a hardened security flow to protect against common web vulnerabilities.

### The Defense Strategy
- **XSS Protection**: We use **HttpOnly Cookies**. By preventing JavaScript access to tokens, we eliminate the primary vector for token theft.
- **Stateful Revocation**: Refresh tokens are hashed and stored in the database. This allows admins or users to "kill" sessions remotely (e.g., if a device is stolen).
- **CSRF Mitigation**: Cookies are sent with `SameSite=Strict` and Secure flags.

### The Rotation Workflow
- **Authenticate**: User logs in; server generates short-lived Access and long-lived Refresh tokens.
- **Transmission**: Both are sent as HttpOnly cookies.
- **Expiration**: When the Access token expires, the browser automatically sends the Refresh cookie to the `/refresh` endpoint.
- **Rotation**: The server verifies the hashed token in the DB, deletes the old one, and issues a brand-new pair.

### Revocation Middleware
A dedicated middleware intercepts every request to verify the session remains active in the database. If a session is revoked, the middleware clears the browser cookies and forces an immediate logout.