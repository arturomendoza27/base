# ============================================
# Base PHP + Apache
# ============================================
FROM php:8.3-apache

# Activar mod_rewrite (Laravel obligatorio)
RUN a2enmod rewrite

# ============================================
# Dependencias del sistema + cliente MySQL (MariaDB)
# ============================================
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
    libicu-dev \
    gnupg \
    # Cliente MySQL (MariaDB) para mysqldump y mysql
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Extensiones PHP necesarias
# ============================================
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

# ============================================
# Instalar Node.js 20 (para Vite build)
# ============================================
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Composer
# ============================================
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ============================================
# Directorio de trabajo
# ============================================
WORKDIR /var/www/html

# Copiar proyecto
COPY . .

# ============================================
# Configurar Apache para apuntar a /public
# ============================================
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ============================================
# Instalar dependencias PHP (sin dev)
# ============================================
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ============================================
# Instalar dependencias frontend y compilar Vite
# ============================================
RUN npm ci \
    && npm run build

# ============================================
# Permisos Laravel
# ============================================
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# ============================================
# Optimización Laravel (cache producción)
# ============================================
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# ============================================
# Exponer puerto
# ============================================
EXPOSE 80

# ============================================
# Comando principal
# ============================================
CMD ["apache2-foreground"]