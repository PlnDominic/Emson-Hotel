@echo off
REM Activate virtual environment if exists
if exist "..\venv\Scripts\activate.bat" (
    call ..\venv\Scripts\activate
)

REM Set environment variables
set FLASK_APP=app.py
set FLASK_ENV=development
set FLASK_DEBUG=1

REM Create logs directory if not exists
if not exist "logs" mkdir logs

REM Run the Flask application
python app.py
