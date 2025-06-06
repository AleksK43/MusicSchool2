# 🎵 Artyz - System Zarządzania Szkołą Muzyczną

**Nowoczesny system zarządzania szkołą muzyczną z zaawansowanym systemem rezerwacji lekcji**

[![Laravel](https://img.shields.io/badge/Laravel-11.x-red?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react)](https://reactjs.org)
[![MariaDB](https://img.shields.io/badge/MariaDB-10.11-brown?logo=mariadb)](https://mariadb.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docker.com)

## 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcjonalności](#-funkcjonalności)
- [Wymagania systemowe](#-wymagania-systemowe)
- [Quick Start](#-quick-start)
- [Struktura projektu](#-struktura-projektu)
- [Domyślne konta](#-domyślne-konta)
- [API](#-api)
- [Rozwój](#-rozwój)
- [Troubleshooting](#-troubleshooting)
- [Licencja](#-licencja)

## 🎯 O projekcie

**Artyz** to kompletny system zarządzania szkołą muzyczną, który łączy nowoczesne technologie webowe z intuicyjnym interfejsem użytkownika. System umożliwia efektywne zarządzanie lekcjami, studentami i nauczycielami w środowisku muzycznym.

### 🎨 Główne cechy

- **🎭 Wielorolowy system**: Admin, Nauczyciele, Studenci
- **📅 Zaawansowany kalendarz**: Rezerwacje z konfliktami i zatwierdzeniami
- **🎵 Specjalizacja muzyczna**: Dostosowany do potrzeb szkół muzycznych
- **📱 Responsywny design**: Działa na wszystkich urządzeniach
- **🔒 Bezpieczeństwo**: JWT tokeny, zabezpieczone API
- **🐳 Konteneryzacja**: Łatwe wdrożenie z Docker

## 🚀 Funkcjonalności

### 👨‍💼 Panel Administratora
- ✅ Zarządzanie użytkownikami (CRUD)
- ✅ Zatwierdzanie rejestracji nowych użytkowników
- ✅ Statystyki i raporty
- ✅ Konfiguracja systemu
- ✅ Monitoring aktywności

### 👨‍🏫 Panel Nauczyciela
- ✅ Zarządzanie kalendarzem lekcji
- ✅ Akceptowanie/odrzucanie próśb o lekcje
- ✅ Proponowanie alternatywnych terminów
- ✅ Zarządzanie studentami
- ✅ Historia lekcji i notatki

### 👩‍🎓 Panel Studenta
- ✅ Rezerwacja lekcji z wybranymi nauczycielami
- ✅ Przeglądanie dostępnych terminów
- ✅ Kalendarz osobisty
- ✅ Historia lekcji
- ✅ Zatwierdzanie zmian terminów

### 🎼 Funkcje muzyczne
- 🎤 Kategoryzacja według instrumentów (wokal, gitara, fortepian, skrzypce, saksofon)
- 🎵 Typy lekcji (indywidualne, grupowe)
- 📚 Biblioteka materiałów edukacyjnych
- 🏠 System wynajmu instrumentów

## 💻 Wymagania systemowe

- **Docker** 20.10+ 
- **Docker Compose** 2.0+
- **Git**
- **8GB RAM** (zalecane)
- **5GB przestrzeni dyskowej**

### Porty używane przez aplikację:
- **3000** - Frontend (React)
- **8000** - Backend (Laravel API)  
- **3306** - Database (MariaDB)

## ⚡ Quick Start

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/your-username/artyz.git
cd artyz
```

### 2. Automatyczne uruchomienie

**Dla systemów Unix/Linux/macOS:**
```bash
chmod +x setup-and-run.sh
./setup-and-run.sh
```

**Dla Windows (PowerShell):**
```powershell
# Uruchom Docker Desktop, następnie:
docker-compose up --build -d

# Poczekaj aż kontenery się uruchomią, następnie:
docker-compose exec backend php artisan key:generate --force
docker-compose exec backend php artisan migrate --force  
docker-compose exec backend php artisan db:seed --force
```

### 3. Dostęp do aplikacji

Po zakończeniu instalacji (2-3 minuty):

- **🌐 Frontend**: http://localhost:3000
- **⚙️ Backend API**: http://localhost:8000/api
- **🗄️ Database**: localhost:3306

## 🏗️ Struktura projektu

```
artyz/
├── 📁 backend/                 # Laravel API
│   ├── 📁 app/
│   │   ├── 📁 Http/Controllers/ # Kontrolery API
│   │   ├── 📁 Models/          # Modele Eloquent
│   │   └── 📁 Http/Middleware/ # Middleware autoryzacji
│   ├── 📁 database/
│   │   ├── 📁 migrations/      # Migracje bazy danych
│   │   └── 📁 seeders/         # Dane testowe
│   └── 📁 routes/api.php       # Definicje API
├── 📁 frontend/                # React aplikacja
│   ├── 📁 src/
│   │   ├── 📁 components/      # Komponenty React
│   │   ├── 📁 pages/          # Strony aplikacji
│   │   ├── 📁 contexts/       # Context API
│   │   └── 📁 services/       # Serwisy API
│   └── 📁 public/
├── 📁 docker/                  # Konfiguracje Docker
├── 🐳 docker-compose.yml       # Orkiestracja kontenerów
├── 🚀 setup-and-run.sh        # Skrypt instalacyjny
└── 🔧 debug.sh               # Skrypt debugowania
```

## 👥 Domyślne konta

Po instalacji dostępne są następujące konta testowe:

### 👨‍💼 Administrator
```
Email: admin@artyz.pl
Hasło: admin123
```

### 👨‍🏫 Nauczyciel
```
Email: anna@artyz.pl  
Hasło: teacher123
Instrument: Wokal
```

### 👩‍🎓 Student
```
Email: maria@artyz.pl
Hasło: student123  
Instrument: Gitara
```

## 🔌 API

### Główne endpointy

#### Autoryzacja
```http
POST /api/login          # Logowanie
POST /api/register       # Rejestracja (wymaga zatwierdzenia)
POST /api/logout         # Wylogowanie
GET  /api/me            # Aktualny użytkownik
```

#### Lekcje (Student)
```http
GET  /api/student/dashboard        # Dashboard studenta
POST /api/student/request-lesson   # Prośba o lekcję
GET  /api/student/teachers         # Lista nauczycieli
GET  /api/student/available-slots  # Dostępne terminy
```

#### Lekcje (Nauczyciel)  
```http
GET   /api/teacher/dashboard       # Dashboard nauczyciela
GET   /api/teacher/pending-requests # Oczekujące prośby
PATCH /api/teacher/lessons/{id}/approve # Zatwierdzenie lekcji
PATCH /api/teacher/lessons/{id}/reject  # Odrzucenie lekcji
```

#### Administracja
```http
GET    /api/admin/dashboard     # Dashboard admina
GET    /api/admin/users        # Lista użytkowników
POST   /api/admin/users        # Tworzenie użytkownika
PUT    /api/admin/users/{id}   # Edycja użytkownika
DELETE /api/admin/users/{id}   # Usuwanie użytkownika
```

### Przykład użycia API

```javascript
// Logowanie
const response = await fetch('http://localhost:8000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@artyz.pl',
    password: 'admin123'
  })
});

const data = await response.json();
const token = data.token;

// Autoryzowane żądanie
const userResponse = await fetch('http://localhost:8000/api/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🛠️ Rozwój

### Uruchomienie w trybie deweloperskim

```bash
# Backend (Laravel)
cd backend
composer install
php artisan serve

# Frontend (React)  
cd frontend
npm install
npm start

# Database
docker run -d \
  --name artyz_db \
  -e MARIADB_DATABASE=artyz_db \
  -e MARIADB_USER=artyz_user \
  -e MARIADB_PASSWORD=artyz_password \
  -e MARIADB_ROOT_PASSWORD=root_password \
  -p 3306:3306 \
  mariadb:10.11
```

### Przydatne komendy

```bash
# Logi kontenerów
docker-compose logs -f [backend|frontend|database]

# Restart aplikacji
docker-compose restart

# Migracje bazy danych
docker-compose exec backend php artisan migrate

# Czyszczenie cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Dostęp do kontenera
docker-compose exec backend bash
docker-compose exec database mariadb -u artyz_user -p artyz_db
```

### Debugowanie

Użyj dołączonego skryptu debugowania:

```bash
chmod +x debug.sh
./debug.sh
```

## 🚨 Troubleshooting

### Problem: Kontenery nie startują
```bash
# Sprawdź status
docker-compose ps

# Sprawdź logi
docker-compose logs backend
docker-compose logs database

# Restart od nowa
docker-compose down -v
docker-compose up --build -d
```

### Problem: Port już zajęty
```bash
# Sprawdź co używa portu
lsof -i :3000  # lub :8000, :3306

# Zmień port w docker-compose.yml
ports:
  - "3001:3000"  # Frontend na porcie 3001
```

### Problem: Błędy bazy danych
```bash
# Reset bazy danych
docker-compose down -v
docker volume rm artyz_mariadb_data
docker-compose up -d database

# Poczekaj chwilę, następnie:
docker-compose up backend frontend
```

### Problem: CORS errors
```bash
# Sprawdź konfigurację CORS w backend/config/cors.php
# Upewnij się, że frontend URL jest w allowed_origins
```

## 🧪 Testowanie

```bash
# Testy backend (Laravel)
docker-compose exec backend php artisan test

# Testy frontend (React)
docker-compose exec frontend npm test
```

## 📦 Deployment

### Produkcja z Docker

```bash
# Budowanie obrazów produkcyjnych
docker-compose -f docker-compose.prod.yml build

# Uruchomienie w trybie produkcyjnym  
docker-compose -f docker-compose.prod.yml up -d
```

### Konfiguracja środowiska produkcyjnego

1. Skopiuj i dostosuj pliki `.env`:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Ustaw bezpieczne hasła i klucze:
   ```bash
   # W backend/.env
   APP_KEY=your-32-character-secret-key
   DB_PASSWORD=your-secure-database-password
   
   # W frontend/.env  
   REACT_APP_API_URL=https://yourdomain.com/api
   ```

## 🤝 Współpraca

1. Fork repozytorium
2. Stwórz branch dla funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

### Standardy kodu

- **Backend**: Laravel conventions, PSR-12
- **Frontend**: React hooks, ES6+, Prettier
- **Database**: Snake_case, meaningful names
- **Commits**: Conventional Commits

## 📄 Licencja

Projekt jest udostępniony na licencji MIT. Zobacz plik `LICENSE` dla szczegółów.

---

**Zbudowano z ❤️ dla społeczności muzycznej**
