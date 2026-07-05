# Use official Python 3.12 slim image as base
FROM python:3.12-slim AS builder

# Set build-time environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /install

# Install build dependencies (required for compiling certain python packages like bcrypt/cryptography if wheels aren't used)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements list first to leverage Docker layer caching
COPY requirements.txt /requirements.txt

# Install packages to a custom user directory
RUN pip install --no-cache-dir --user -r /requirements.txt

# -----------------------------------------------------------------------------
# Runner Stage
# -----------------------------------------------------------------------------
FROM python:3.12-slim AS runner

# Set run-time environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH=/root/.local/bin:$PATH

WORKDIR /app

# Copy dependencies installed in the builder stage
COPY --from=builder /root/.local /root/.local

# Copy the rest of the application files
COPY app/ /app/app/
COPY README.md /app/

# Expose port 8000
EXPOSE 8000

# Start server using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
