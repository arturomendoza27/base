FROM php:8.2-fpm

# Instalar dependencias del sistema necesarias para Laravel y PhpSpreadsheet
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev

# Instalar extensiones PHP obligatorias
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        bcmath \
        gd \
        zip \
        exif \
        pcntl

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio de trabajo
WORKDIR /var/www

# Copiar proyecto
COPY . .

# Instalar dependencias Laravel
RUN composer install --optimize-autoloader --no-interaction

# Permisos (importante para storage y cache)
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"] 
