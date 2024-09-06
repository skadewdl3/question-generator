FROM python:3.11-slim
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN pip install chromadb pymupdf Flask flask-cors
EXPOSE 5000
COPY ./app.py .
CMD ["flask", "run", "--debug"]
