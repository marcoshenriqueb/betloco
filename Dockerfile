# Use an official Python runtime as a base image
FROM python:3.5-slim
RUN apt-get update
RUN apt-get -y install python3-dev libpq-dev apt-utils gcc build-essential libssl-dev libffi-dev libzmq-dev libevent-dev

ENV PYTHONUNBUFFERED 1
RUN mkdir /code

# Set the working directory to /app
WORKDIR /code

# Install any needed packages specified in requirements.txt
ADD requirements.txt /code
RUN pip install -r requirements.txt

# Copy the current directory contents into the container at /app
ADD . /code

RUN python manage.py collectstatic --noinput

CMD ["python", "manage.py", "migrate", "&&", "gunicorn", "betloco.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]