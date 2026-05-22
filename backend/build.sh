#!/usr/bin/env bash
set -o errexit

echo "Upgrading pip..."
python -m pip install --upgrade pip

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

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