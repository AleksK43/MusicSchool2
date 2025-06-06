FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    mariadb-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY . .

# Copy .env.example as default .env
COPY .env.example .env

# Run composer scripts
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting Artyz Backend..."\n\
echo "Waiting for MariaDB..."\n\
while ! mariadb -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1" "$DB_DATABASE" &> /dev/null; do\n\
    echo "Database not ready, waiting..."\n\
    sleep 2\n\
done\n\
echo "Database ready!"\n\
\n\
echo "Setting up Laravel..."\n\
php artisan config:clear\n\
php artisan cache:clear\n\
php artisan view:clear\n\
\n\
echo "Starting PHP built-in server..."\n\
exec php artisan serve --host=0.0.0.0 --port=8000' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

# Expose port 8000
EXPOSE 8000

# Use startup script
CMD ["/usr/local/bin/start.sh"]