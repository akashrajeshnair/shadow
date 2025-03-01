# Use an official lightweight Python image
FROM python:3.8-slim

# Set the working directory inside the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only necessary files
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the Flask app port and SSH honeypot port
EXPOSE 5001 2222

# Command to run the SSH emulator
CMD ["python", "app/main.py"]