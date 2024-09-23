
# Run database migrations
echo "Running makemigrations..."
python manage.py migrate || exit 1
python manage.py makemigrations || exit 1

echo "Running migrate..."
python manage.py migrate || exit 1

# Start the Django development server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8282


