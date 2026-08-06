## ⚡ Performance Optimization: Laravel Octane

Our default stack runs on standard **PHP-FPM + Nginx** for maximum simplicity and compatibility. However, if you are expecting high traffic or want to minimize response latency, this codebase is fully compatible with **Laravel Octane (using FrankenPHP)**.

### How to Switch to Laravel Octane

If you wish to switch back to Octane in development or production:

1. **Update the Dockerfile:**
   Switch the base image in the `Dockerfile` to FrankenPHP, restore port `8000`, and update the container startup command:
   ```dockerfile
   FROM dunglas/frankenphp:1.4-php8.4
   ...
   EXPOSE 80 443 8000
   CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000", "--workers=4"]
