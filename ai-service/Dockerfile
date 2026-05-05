# Use stable Python
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose AI port
EXPOSE 5001

# Run Flask app
CMD ["python", "app.py"]