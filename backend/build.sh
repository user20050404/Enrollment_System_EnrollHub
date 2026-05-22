#!/usr/bin/env bash
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Creating static files directory..."
mkdir -p staticfiles

echo "Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "Running migrations..."
python manage.py migrate

echo "Creating superuser..."
python manage.py shell -c "
from apps.accounts.models import User;
if not User.objects.filter(email='kd.aligsao@gmail.com').exists():
    User.objects.create_superuser(
        email='kd.aligsao@gmail.com',
        password='Admin@12345',
        first_name='Kent',
        last_name='Aligsao'
    );
    print('Superuser created!');
else:
    print('Superuser already exists.');
"

echo "Build completed!"