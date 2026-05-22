#!/usr/bin/env bash
set -o errexit

# Ensure pip is up to date
python -m pip install --upgrade pip

echo "Installing dependencies..."
pip install -r requirements.txt

# CRITICAL STEP: Move into the directory containing manage.py
cd backend

echo "Collecting static files..."
# Added --no-post-process flag to prevent WhiteNoise compression failure on broken pathing
python manage.py collectstatic --no-input --no-post-process

echo "Running migrations..."
python manage.py migrate

echo "Creating superuser if missing..."
python manage.py shell -c "
from apps.accounts.models import User;
if not User.objects.filter(email='kd.aligsao@gmail.com').exists():
    User.objects.create_superuser(
        email='kd.aligsao@gmail.com',
        username='admin_kent',
        password='Admin@12345'
    )
    print('Superuser created successfully!')
else:
    print('Superuser already exists.')
"

echo "Build completed successfully!"