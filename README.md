# 🍽️ ServeCafe - Restaurant Management System

start the server

````bash
npm run dev

php artisan serve

php artisan c

    ```

A modern restaurant management system built with Laravel 11, React, Inertia.js, Tailwind CSS, and DaisyUI.

## 🚀 Quick Start

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js 18+ and npm
-   Git

### Installation & Setup

1. **Clone the repository**

    ```bash
    git clone git@github.com:talktokris/service_cafe.git
    cd service_cafe
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database setup**

    ```bash
    php artisan migrate
    ```

6. **Build assets**
    ```bash
    npm run build
    ```

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)

**Terminal 1 - Start Laravel Server:**

```bash
php artisan serve --host=127.0.0.1 --port=8000
````

**Terminal 2 - Start Vite Dev Server (for hot reload):**

```bash
npm run dev
```

**Access the application:**

-   Main App: http://127.0.0.1:8000
-   Vite Dev Server: http://127.0.0.1:5173

### Production Mode

```bash
npm run build
php artisan serve --host=127.0.0.1 --port=8000
```

## 🛠️ Tech Stack

-   **Backend**: Laravel 11.45.2
-   **Frontend**: React 18 with Inertia.js
-   **Styling**: Tailwind CSS v3 + DaisyUI
-   **Build Tool**: Vite
-   **Database**: SQLite (default)

## 📁 Project Structure

```
servecafe/
├── resources/
│   ├── js/
│   │   ├── Pages/          # React page components
│   │   ├── Layouts/        # Layout components
│   │   └── app.js         # Main React entry point
│   ├── css/app.css        # Tailwind CSS
│   └── views/app.blade.php # Main Blade template
├── routes/web.php         # Application routes
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── package.json           # Node.js dependencies
```

## 🎨 Features

-   ✅ Modern React components with Inertia.js
-   ✅ Beautiful DaisyUI components
-   ✅ Responsive Tailwind CSS styling
-   ✅ Hot reload for development
-   ✅ Laravel 11 with latest features
-   ✅ Clean project structure

## 🔧 Development Commands

```bash
# Install dependencies
composer install
npm install

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Build for production
npm run build

# Development with hot reload
npm run dev
```

## 📝 Notes

-   The application uses SQLite by default (no database setup required)
-   Hot reload is enabled in development mode
-   All assets are automatically compiled and served by Vite
-   DaisyUI theme is set to "light" by default

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
# Test deployment
