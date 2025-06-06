#!/bin/bash

echo "🚀 Artyz - Setup and Run Script"
echo "================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start containers
echo "📦 Building and starting containers..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for MariaDB to be ready..."
echo "   This should be much faster than MySQL (30-45 seconds)..."

# Wait for MariaDB to be ready with proper health check
until docker-compose exec database mariadb -u artyz_user -partyz_password -e "SELECT 1" artyz_db &> /dev/null; do
    echo "   Database not ready yet, waiting 3 more seconds..."
    sleep 3
done

echo "✅ MariaDB is ready!"

# Check if containers are running
echo "🔍 Checking container status..."
docker-compose ps

# Run Laravel setup commands
echo "🔧 Setting up Laravel backend..."

# Copy .env.example to .env in container (preserving local .env for development)
echo "📋 Setting up environment configuration in container..."
docker-compose exec backend cp .env.example .env

# Generate application key
echo "🔑 Generating application key..."
docker-compose exec backend php artisan key:generate --force

# Test database connection
echo "🔌 Testing database connection..."
if docker-compose exec backend php artisan tinker --execute="try { DB::connection()->getPdo(); echo 'Database connected successfully!'; } catch(Exception \$e) { echo 'Database connection failed: ' . \$e->getMessage(); }"; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed!"
    echo "🔍 Checking database logs..."
    docker-compose logs database
fi

# Test API endpoint
echo "🌐 Testing API endpoint..."
sleep 5  # Give server time to start
if curl -f http://localhost:8000/api/health &> /dev/null; then
    echo "✅ API endpoint responding!"
else
    echo "❌ API endpoint not responding!"
    echo "🔍 Checking backend logs..."
    docker-compose logs backend
fi

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec backend php artisan migrate --force

# Run seeders
echo "🌱 Running database seeders..."
docker-compose exec backend php artisan db:seed --force

# Clear and cache config
echo "🧹 Clearing and caching configuration..."
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan config:cache
docker-compose exec backend php artisan route:cache

# Set proper permissions
echo "🔐 Setting proper permissions..."
docker-compose exec backend chown -R www-data:www-data /var/www/storage
docker-compose exec backend chmod -R 775 /var/www/storage

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Your application is now running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api"
echo "   Database: localhost:3306"
echo ""
echo "📋 Default admin credentials:"
echo "   Email: admin@artyz.pl"
echo "   Password: admin123"
echo ""
echo "📋 Default teacher credentials:"
echo "   Email: anna@artyz.pl"
echo "   Password: teacher123"
echo ""
echo "📋 Default student credentials:"
echo "   Email: maria@artyz.pl"
echo "   Password: student123"
echo ""
echo "🛠️ Useful commands:"
echo "   Stop containers: docker-compose down"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo ""