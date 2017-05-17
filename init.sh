#!/bin/sh

python manage.py migrate
gunicorn betloco.wsgi:application --bind 0.0.0.0:8000 --workers 3