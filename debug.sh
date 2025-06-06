#!/bin/bash

echo "🔍 Artyz Debug Script"
echo "===================="

echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌐 Network Information:"
docker network ls | grep artyz

echo ""
echo "🔌 Testing Database Connection:"
echo "Trying to connect to MariaDB (using mysql driver)..."
if docker-compose exec database mariadb -u artyz_user -partyz_password -e "SELECT 1 as test;" artyz_db 2>/dev/null; then
    echo "✅ MariaDB connection successful!"
    echo "Database version:"
    docker-compose exec database mariadb -u artyz_user -partyz_password -e "SELECT VERSION() as version;" artyz_db 2>/dev/null
    echo "Confirming this is MariaDB:"
    docker-compose exec database mariadb -u artyz_user -partyz_password -e "SELECT @@version_comment as database_type;" artyz_db 2>/dev/null
else
    echo "❌ MariaDB connection failed!"
    echo "Database logs:"
    docker-compose logs --tail=20 database
fi

echo ""
echo "🔧 Backend Environment Check:"
echo "APP_KEY in container:"
docker-compose exec backend printenv APP_KEY

echo ""
echo "Backend .env file exists:"
docker-compose exec backend ls -la .env

echo ""
echo "Database config in container:"
docker-compose exec backend printenv | grep DB_

echo ""
echo "🌐 API Endpoint Tests:"
echo "Testing /api/test endpoint:"
if curl -s http://localhost:8000/api/test | jq . 2>/dev/null; then
    echo "✅ API test endpoint working!"
else
    echo "❌ API test endpoint failed!"
    echo "Trying with curl verbose:"
    curl -v http://localhost:8000/api/test
fi

echo ""
echo "Testing /api/health endpoint:"
if curl -s http://localhost:8000/api/health | jq . 2>/dev/null; then
    echo "✅ API health endpoint working!"
else
    echo "❌ API health endpoint failed!"
fi

echo ""
echo "🔍 Recent Backend Logs:"
docker-compose logs --tail=30 backend

echo ""
echo "🔍 Recent Database Logs:"
docker-compose logs --tail=10 database

echo ""
echo "🔍 Recent Frontend Logs:"
docker-compose logs --tail=10 frontend

echo ""
echo "🌐 Port Check:"
echo "Checking if ports are accessible..."
nc -zv localhost 8000 && echo "✅ Port 8000 (backend) is open" || echo "❌ Port 8000 (backend) is closed"
nc -zv localhost 3000 && echo "✅ Port 3000 (frontend) is open" || echo "❌ Port 3000 (frontend) is closed"
nc -zv localhost 3306 && echo "✅ Port 3306 (database) is open" || echo "❌ Port 3306 (database) is closed"

echo ""
echo "🔧 Laravel Artisan Status:"
docker-compose exec backend php artisan --version

echo ""
echo "🗄️ Migration Status:"
docker-compose exec backend php artisan migrate:status 2>/dev/null || echo "❌ Migrations not run or database not accessible"

echo ""
echo "Debug complete! Check the output above for any issues."