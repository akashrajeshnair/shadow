# Use an official lightweight Python image
FROM python:3.8-slim

ARG OPENCV_VERSION="4.11.0.86"

# Set the working directory inside the container
WORKDIR /app

RUN apt-get update && apt-get install -y curl xz-utils && rm -rf /var/lib/apt/lists/*

RUN curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz \
    | tar -xJ --strip-components=1 -C /usr/local/bin

# Copy only necessary files
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the Flask app port
EXPOSE 5001

# Command to run the MQTT emulator
CMD ["python", "app/main.py"]
