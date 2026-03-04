FROM php:8.3-apache

# Activar mod_rewrite (obligatorio para Laravel)
RUN a2enmod rewrite

# Dependencias del sistema
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
    libxml2-dev \
    libicu-dev

# Extensiones PHP necesarias
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        bcmath \
        gd \
        zip \
        exif \
        pcntl \
        xml \
        intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Directorio del servidor web (Laravel usa /public)
WORKDIR /var/www/html

# Copiar proyecto
COPY . .

# Configurar Apache para apuntar a /public (CRÍTICO)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Crear .env si no existe
RUN cp .env.example .env || true

# Instalar dependencias Laravel
RUN composer install --optimize-autoloader --no-interaction --no-scripts

# Permisos Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80
CMD ["apache2-foreground"]
