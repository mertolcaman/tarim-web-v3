# 📦 Base image with Python
FROM python:3.11-slim

# 🏠 Set working directory
WORKDIR /app

# Copy only requirements first (better caching)
COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Then copy everything else
COPY . .


# 🔁 Set environment variable to ensure live reload off in container
ENV PYTHONUNBUFFERED=1

# 🌐 Expose FastAPI's default port
EXPOSE 8000

# 🚀 Run the FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
