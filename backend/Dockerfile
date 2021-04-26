FROM python:3.8-slim
RUN apt-get update && \
    apt-get install gcc -y && \
    apt-get clean
COPY requirements.txt /
RUN pip install -r /requirements.txt
COPY . /app
WORKDIR /app