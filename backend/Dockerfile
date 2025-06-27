# 📦 Base image with Python
FROM python:3.11-slim

# 🏠 Set working directory
WORKDIR /app

# 🚀 Copy project files
COPY . .

# Copy only requirements first for better caching
COPY requirements.txt .

# 🔐 Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# 🔁 Set environment variable to ensure live reload off in container
ENV PYTHONUNBUFFERED=1

# 🌐 Expose FastAPI's default port
EXPOSE 8000

# 🚀 Run the FastAPI app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
