#!/bin/sh
set -e

# 1. Check and install dependencies (mandatory step before running any php artisan commands)
if [ ! -d "vendor" ] || [ -z "$(ls -A vendor)" ]; then
    echo "Vendor folder is empty. Installing dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# 2. Set core directory permissions to ensure Artisan has write access
echo "Setting up directory permissions..."
chown -R www-data:www-data /var/www
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# 3. Generate application key (safe to run now that vendor dependencies exist)
if ! grep -q "APP_KEY=base64" .env; then
    echo "Generating secure APP_KEY..."
    php artisan key:generate --force
fi

# 4. Generate JWT Secret key
if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=$" .env; then
    echo "JWT_SECRET is missing or empty. Generating a secure JWT secret..."
    php artisan jwt:secret --force
fi

# 5. Wait for the database service to become healthy and available
echo "Waiting for database connection..."
until php artisan db:monitor --databases=mysql > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

# 6. Run database migrations and seeders
echo "Running database migrations..."
php artisan migrate --force

# 7. Clear configuration and application cache
php artisan config:clear
php artisan cache:clear

# 8. If no specific command (or a malformed command) was passed, fallback to starting PHP-FPM
if [ -z "$1" ] || [ "$1" = "la" ] || [ "$1" = "la\r" ]; then
    echo "Starting PHP-FPM (Fallback)..."
    exec php-fpm
else
    echo "Executing passed command: $@"
    exec "$@"
fi