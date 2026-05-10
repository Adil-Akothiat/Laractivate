## 📋 Notification Types Reference

Use the `NotificationService` to trigger these pre-defined types:

### 1. Authentication & Onboarding
| Method | Icon | Key | Description |
| :--- | :---: | :--- | :--- |
| `welcome()` | 👤 | `user-plus` | Triggered after registration or first login. |
| `info()` | ℹ️ | `info` | General tips or "Email Verification" reminders. |

### 2. Security & Account
| Method | Icon | Key | Description |
| :--- | :---: | :--- | :--- |
| `security()` | ⚠️ | `alert` | Critical alerts: Password changes, 2FA toggles, or unusual logins. |
| `success()` | ✅ | `check` |w Confirms successful profile updates or settings changes. |

### 3. System & Maintenance
| Method | Icon | Key | Description |
| :--- | :---: | :--- | :--- |
| `send()` | 🔔 | `bell` | Used for site-wide announcements or manual admin alerts. |
| `mail()` | ✉️ | `mail` | Alerts related to inbox messages or external communications. |

---

## 💻 Usage Examples

### Backend (Laravel)
Inject the `NotificationService` into your Controller or Listener:

```php
public function __construct(protected NotificationService $notifications) {}

public function handleLogin($user) {
    $this->notifications->welcome($user, "Welcome back!", "Great to see you again.");
}