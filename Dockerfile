FROM python:3.9
WORKDIR /HHC
COPY requirement.txt /HHC/
RUN pip install -r requirement.txt
COPY . /HHC
EXPOSE 8282
CMD ["./commandpoint.sh"]#or ["python manage.py runserver 0.0.0.0:7070"]
