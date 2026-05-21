#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create static files directory
mkdir -p staticfiles

# Collect static files (use simpler storage first)
python manage.py collectstatic --no-input --clear

# Run migrations
python manage.py migrate