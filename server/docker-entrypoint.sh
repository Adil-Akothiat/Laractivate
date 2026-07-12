#!/bin/sh
set -e

# 1. فحص وتثبيت الحزم أولاً (خطوة إجبارية قبل أي أمر php artisan)
if [ ! -d "vendor" ] || [ -z "$(ls -A vendor)" ]; then
    echo "Vendor folder is empty. Installing dependencies..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# 2. ضبط الصلاحيات الأساسية للمجلدات لضمان قدرة الـ Artisan على الكتابة
echo "Setting up directory permissions..."
chown -R www-data:www-data /var/www
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# 3. توليد مفتاح التطبيق (الآن سيعمل بأمان لأن الـ vendor موجود)
if ! grep -q "APP_KEY=base64" .env; then
    echo "Generating secure APP_KEY..."
    php artisan key:generate --force
fi

# 4. توليد مفتاح JWT
if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=$" .env; then
    echo "JWT_SECRET is missing or empty. Generating a secure JWT secret..."
    php artisan jwt:secret --force
fi

# 5. الانتظار حتى استقرار قاعدة البيانات
echo "Waiting for database connection..."
until php artisan db:monitor --databases=mysql > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Running database migrations and seeding..."
php artisan migrate --force

echo "Checking if database need seeding..."
ROLE_COUNT=$(php artisan eval "echo \App\Models\Role::count();" 2>/dev/null || echo "0")
if [ "$ROLE_COUNT" = "0" ] || [ -z "$ROLE_COUNT" ]; then
    echo "Database is empty. Running seeders..."
    php artisan db:seed --force
else
    echo "Database already seeded. Skipping..."
fi

# clear cache
php artisan config:clear
php artisan cache:clear

# execute cmd
exec "$@"