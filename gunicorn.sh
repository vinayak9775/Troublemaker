#!/bin/bash
ls
pwd
cd ..
source myenv/bin/activate
cd HHC_CICD

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic -- no-input

echo "Migrations done"

# cd /var/lib/jenkins/workspace/django-cicd

sudo cp -rf hhc_cicd_gunicorn.socket /etc/systemd/system/
sudo cp -rf hhc_cicd_gunicorn.service /etc/systemd/system/

echo "$USER"
echo "$PWD"



sudo systemctl daemon-reload
sudo systemctl start hhc_cicd_gunicorn

echo "hhc_cicd_gunicorn has started."

sudo systemctl enable hhc_cicd_gunicorn

echo "hhc_cicd_gunicorn has been enabled."

sudo systemctl restart hhc_cicd_gunicorn


sudo systemctl status hhc_cicd_gunicorn

