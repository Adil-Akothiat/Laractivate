#!/bin/sh
set -e

# 1. Check if vendor directory is empty
if [ ! -d "vendor" ] || [ -z "$(ls -A vendor)" ]; then
    echo "Vendor folder is empty. Installing dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# 2. Ensure storage and bootstrap/cache are writable
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 3. Run migrations (Optional but helpful for local dev)
# php artisan migrate --force

# 4. Execute the main container command (usually php-fpm)
exec "$@"