@echo off

REM Open terminal 1 (Frontend)
start cmd /k "cd client & npm run dev"

REM Open terminal 2 (Backend)
start cmd /k "cd server & php artisan serve"