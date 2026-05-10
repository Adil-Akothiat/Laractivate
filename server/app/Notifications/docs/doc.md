# Notifications

## Best Practices
*   **Use `toArray()`**: Always provide a `toArray` or `toDatabase` representation. This allows your React/Next.js frontend to display a notification bell with consistent data.
*   **Asynchronous Delivery**: Always use the `Queueable` trait and consider implementing `ShouldQueue` for mail or third-party API channels to prevent HTTP timeouts.
*   **Clean Templates**: If a notification becomes too complex (e.g., a detailed HTML email), move the content to a dedicated Blade view using `->view()` within the `MailMessage`.

---

### Professional Integration Tip
In your `UserResource`, you can easily provide the user's unread notification count or recent alerts. This pairs perfectly with the `database` channel used in `GeneralAppNotification`, giving your SaaS dashboard real-time feel.

**The backend documentation is now virtually complete. Should we move intoFollowing the consistent documentation style of **AuthPanel**, here is the documentation for the **Notifications** layer. This layer serves as the unified delivery system for communicating with users across various channels.

---

### 1. Main Directory Documentation: `app/Notifications/docs/doc.md`

# Notifications

## Purpose: 
- **The Delivery System**: Acts as a unified transport layer to send messages to users via multiple channels (Database, Mail, SMS, etc.) based on application events.

## Include:
- **Channel Definitions**: Specifying where the message goes (via `toMail`, `toDatabase`, `toArray`).
- **Content Formatting**: Constructing the specific message blocks, email lines, or JSON payloads for the frontend.
- **Queueing**: Leveraging the `ShouldQueue` interface to ensure notifications are sent in the background without slowing down the user experience.

## Do NOT Include:
- **Trigger Logic**: The decision-making process (e.g., "Should we notify the user?") should live in a **Service** or **Listener**.
- **Complex Data Fetching**: Pass the necessary data into the notification constructor instead of querying the database inside the notification class.

## Directory Structure
Notifications/
├─ GeneralAppNotification.php  # Flexible notification for system updates
└─ docs/
   └─ doc.md

Check:[Notification Guide Implementation](./notifications.md)