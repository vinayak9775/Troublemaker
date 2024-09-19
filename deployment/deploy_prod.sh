#!/bin/sh

ssh root@192.168.1.109 <<EOF
  cd /var/www/html/Aggregation_test_project/Troublemakers
  git pull
  source /var/www/html/Aggregation_test_project/myenv/bin/activate
  yes | python manage.py collectstatic
  ./manage.py makemigrations
  ./manage.py migrate  --run-syncdb
  sudo service gunicorn restart
  sudo service nginx restart
  exit
EOF
