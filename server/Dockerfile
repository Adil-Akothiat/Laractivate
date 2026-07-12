# استخدام الصورة الرسمية المستقرة (تأكد من رقم الإصدار المتوافق مع Laravel لديك)
FROM dunglas/frankenphp:1.4-php8.4

# تثبيت ملحقات PHP الأساسية لـ Laravel باستخدام الأداة الذكية المدمجة في الصورة
RUN install-php-extensions pdo_mysql mbstring zip exif pcntl bcmath gd

# تثبيت الأدوات المساعدة للنظام
RUN apt-get update && apt-get install -y \
    zip \
    unzip \
    git \
    curl \
    vim

# تنظيف الـ Cache لتقليل حجم الحاوية
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# إعداد الـ Entrypoint الخاص بك
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]

# جلب الـ Composer داخل الحاوية
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# ضبط الصلاحيات للمستخدم الافتراضي لـ FrankenPHP/Apache
RUN chown -R www-data:www-data /var/www

# فتح المنافذ اللازمة (FrankenPHP يدعم 80 و 443 مسبقاً، و8000 لـ Octane)
EXPOSE 80 443 8000

# تشغيل Laravel Octane مع FrankenPHP كمحرك أساسي
CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]