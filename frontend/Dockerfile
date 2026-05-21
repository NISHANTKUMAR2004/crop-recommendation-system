# Frontend Docker - Serve static files using Nginx
FROM nginx:alpine

# Copy frontend files to nginx
COPY . /usr/share/nginx/html/

# Copy nginx config (optional - if you have a custom config)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
