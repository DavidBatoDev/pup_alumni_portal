@echo off

REM Open terminal 1 (Frontend)
start cmd /k "cd client & npm run dev -- --host"

REM Open terminal 2 (Backend)
start cmd /k "cd server & php artisan serve"

REM Open terminal 3 (Backend: Reverb Server)
start cmd /k "cd server & php artisan reverb:start"