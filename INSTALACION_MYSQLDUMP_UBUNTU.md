# Instalación de mysqldump en Ubuntu (VPS Oracle/Dokploy)

## Problema
El controlador de backup requiere el comando `mysqldump` para generar respaldos de la base de datos. En entornos de producción con Ubuntu (especialmente en VPS Oracle con Dokploy), este comando no está instalado por defecto.

## Solución

### 1. Instalar mysql-client

Conéctese al servidor VPS via SSH y ejecute:

```bash
# Actualizar lista de paquetes
sudo apt-get update

# Instalar mysql-client (que incluye mysqldump)
sudo apt-get install mysql-client -y

# Verificar la instalación
which mysqldump
mysqldump --version
```

### 2. Configurar el archivo .env

En el archivo `.env` de producción, agregue la siguiente línea:

```env
MYSQLDUMP_PATH="mysqldump"
```

### 3. Configurar permisos del directorio de respaldos

```bash
# Crear directorio si no existe
mkdir -p storage/app/backups

# Asignar permisos adecuados (ajustar usuario según su configuración)
sudo chmod 775 storage/app/backups
sudo chown www-data:www-data storage/app/backups  # Para Apache
# O si usa Nginx:
# sudo chown nginx:nginx storage/app/backups
```

### 4. Verificar la configuración

```bash
# Desde la aplicación Laravel, puede verificar con:
php artisan tinker --execute="echo app('App\Http\Controllers\BackupController')->isMysqldumpAvailable() ? 'mysqldump disponible' : 'mysqldump NO disponible';"
```

## Solución alternativa para contenedores Docker

Si está usando Docker con Dokploy, agregue al Dockerfile:

```dockerfile
# Instalar mysql-client en el contenedor
RUN apt-get update && apt-get install -y mysql-client
```

Luego reconstruya la imagen:

```bash
docker-compose build
docker-compose up -d
```

## Solución para bases de datos en contenedores separados

Si la base de datos está en un contenedor separado (ej: `mysql` o `mariadb`), puede:

### Opción A: Instalar mysql-client en el contenedor de la aplicación
Siga los pasos anteriores para el Dockerfile.

### Opción B: Usar el mysqldump del contenedor de base de datos
```bash
# Ejecutar mysqldump desde el contenedor de base de datos
docker exec nombre_contenedor_mysql mysqldump --host=localhost --user=usuario --password=contraseña nombre_bd > backup.sql
```

### Opción C: Configurar acceso desde la aplicación al contenedor de BD
Asegúrese de que:
1. El contenedor de la aplicación pueda conectarse al contenedor de BD
2. Las credenciales en `.env` apunten al servicio de BD correcto
3. `mysqldump` esté instalado en el contenedor de la aplicación

## Verificación final

1. Acceda a la interfaz web del sistema
2. Navegue a "Respaldo BD" en el menú lateral
3. Intente generar un respaldo
4. Si todo está correcto, debería ver "Respaldo generado exitosamente"

## Solución de problemas

### Error: "mysqldump: command not found"
- Verifique que mysql-client esté instalado: `dpkg -l | grep mysql-client`
- Si no está instalado, ejecute: `sudo apt-get install mysql-client -y`

### Error: "Access denied for user"
- Verifique las credenciales de la base de datos en `.env`
- Asegúrese de que el usuario tenga permisos para hacer respaldos

### Error: "Can't connect to MySQL server"
- Verifique que la base de datos esté ejecutándose
- Compruebe la configuración de red entre contenedores (si usa Docker)
- Verifique el host y puerto en `.env`

## Notas importantes

1. **Seguridad**: Nunca almacene contraseñas en scripts o archivos de configuración sin protección
2. **Respaldos automáticos**: Considere configurar respaldos automáticos via cron
3. **Almacenamiento**: Los respaldos se guardan en `storage/app/backups/backup.sql`
4. **Espacio en disco**: Monitoree el espacio en disco para evitar que se llene con respaldos

## Comandos útiles para monitoreo

```bash
# Verificar espacio en disco
df -h

# Verificar tamaño del directorio de respaldos
du -sh storage/app/backups/

# Listar respaldos
ls -la storage/app/backups/

# Verificar que mysqldump funcione manualmente
mysqldump --host=127.0.0.1 --port=3306 --user=usuario --password=contraseña nombre_bd --no-data
```

Con estos pasos, el sistema de respaldos debería funcionar correctamente en su VPS Ubuntu con Dokploy.