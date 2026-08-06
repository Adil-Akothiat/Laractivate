# Use the official PHP 8.4 FPM stable image
FROM php:8.4-fpm

# Install core PHP extensions required by Laravel using the smart installer
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions pdo_mysql mbstring zip exif pcntl bcmath gd opcache

# Install essential system utilities
RUN apt-get update && apt-get install -y \
    zip \
    unzip \
    git \
    curl \
    vim

# Clean apt cache to reduce container size
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy and set execution permissions for the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]

# Bring Composer into the container
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Set correct ownership for default web server user
RUN chown -R www-data:www-data /var/www

# Expose standard PHP-FPM port
EXPOSE 9000

# Start PHP-FPM by default
CMD ["php-fpm"]