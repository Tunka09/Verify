FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install dlib-bin first (pre-compiled), then face-recognition without deps
RUN pip install --upgrade pip && \
    pip install dlib-bin==19.24.6 && \
    pip install face-recognition --no-deps && \
    pip install face-recognition-models && \
    pip install -r requirements.txt --ignore-installed dlib-bin

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start command - Railway sets PORT env variable
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
