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
    cd your-repository-name
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

8. (Optional) Install front-end dependencies and compile assets:
    ```bash
    npm install
    npm run dev
    ```

9. Serve the application:
    ```bash
    php artisan serve
    ```

10. Access the app at `http://localhost:8000`.
