# Laravel Project

This is a Laravel project. Follow the steps below to install and run it locally.

## Prerequisites
- PHP >= 7.3
- Composer
- Node.js and NPM (optional for front-end assets)
- MySQL or any other database

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/DavidBatoDev/pup_alumni_portal.git
    ```

2. Navigate to the project folder:
    ```bash
    cd pup_alumni_portal
    cd client
    npm install
    cd ../server
    ```

3. Install dependencies:
    ```bash
    composer install
    ```

4. Copy the `.env.example` file and configure your environment:
    ```bash
    cp .env.example .env
    ```

5. Generate an application key:
    ```bash
    php artisan key:generate
    ```

6. Set up the database in the `.env` file.

7. Run migrations:
    ```bash
    php artisan migrate
    ```

8. Install dependencies and compile assets:
    ```bash
    npm install
    ```

9. Serve the application:
    ```bash
    Frontend:
    cd client
    npm run dev

    Backend:
    cd server
    php artisan serve
    ```

10. Access the app at `http://localhost:8000`.
