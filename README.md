# 🚀 Laravel 12 Inertia React App

This is a **Laravel 12** application using **Inertia.js + React**, styled with **Tailwind CSS & shadcn/ui**, and powered by **TanStack Query & TanStack Table** for modern data handling.

The project is designed as a **full-stack monolith** with a SPA-like experience.

---

## 🧱 Tech Stack

### Backend
- Laravel 12
- PHP 8.2+
- MySQL
- Inertia.js

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- TanStack Query
- TanStack Table
- Vite

---

## 📋 Prerequisites

Make sure you have the following installed:

- PHP **>= 8.2**
- Composer
- Node.js **>= 18**
- npm
- MySQL
- Git

---

## ⚙️ Installation (Local Development)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rizalgrandonk/test-pos-mini.git
cd test-pos-mini
```

### 2️⃣ Install PHP dependencies
```bash
composer install
```

### 3️⃣ Install JavaScript dependencies
```bash
npm install
```

### 4️⃣ Environment configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Update the following values in `.env`:

```bash
APP_NAME="Your App Name"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost
APP_FAKER_LOCALE=id_ID

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Generate the application key:
```bash
php artisan key:generate
```

### 5️⃣ Run database migrations & seeders
```bash
php artisan migrate:fresh --seed
```

### 6️⃣ Build frontend assets
```bash
npm run build
```

### 7️⃣ Start the Laravel server
```bash
composer run dev
#or
php artisan serve
```
Default user login generated from seeder:
- email: test@example.com
- password: password

---

## 🗂️ Project Structure (Important Parts)
```text
├── app
│   ├── Actions/
│   ├── Http
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   └── Providers/
├── config/
├── database
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── resources
│   ├── css
│   │   └── app.css
│   ├── js
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Inertia pages
│   │   ├── layouts/           # App layouts
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # Shared TS types
│   └── views
│       └── app.blade.php
├── routes
├── README.md
```

---

## 📊 Data Tables

This project uses:
- TanStack Table for UI
- TanStack Query for server-side pagination, sorting, filtering

All table data is:
- Paginated server-side
- Sorted server-side
- Filtered server-side
- Flattened for relational data

---

##  🧩 Forms & Inputs

- Uses Inertia `<Form>` component and `useForm` hook
- Custom inputs are Form-context aware
- Supports:
    - Async searchable select
    - Date inputs
    - Price inputs
    - Validation error handling
    - Optimistic UX

---

## ✨ Final Notes

This project is intended as:
- A modern Laravel + React reference
- A scalable admin/dashboard foundation
- A clean Inertia-first architecture