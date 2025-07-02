# docker/app/Dockerfile
FROM php:8.2-fpm-alpine

# Instala dependencias del sistema y extensiones de PHP
RUN apk add --no-cache \
    nginx \
    mysql-client \
    curl \
    unzip \
    git \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    freetype-dev \
    icu-dev \
    && docker-php-ext-install pdo_mysql exif pcntl bcmath gd intl opcache zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establece el directorio de trabajo
WORKDIR /var/www/html

# *** NUEVA LÍNEA IMPORTANTE: Copia los archivos de tu proyecto al contenedor ***
# Esto asegura que los directorios 'storage' y 'bootstrap/cache' existan
# antes de intentar cambiar sus permisos.
COPY . .

# Configura los permisos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage \
    /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Exponer el puerto de PHP-FPM
EXPOSE 9000

# El comando por defecto cuando el contenedor se inicia
CMD ["php-fpm"]