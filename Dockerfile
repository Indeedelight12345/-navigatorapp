(The file `/workspaces/-navigatorapp/Dockerfile` exists, but is empty)
## Multi-stage build: build with Node, serve with nginx
FROM node:18-alpine AS build
WORKDIR /app

# Allow passing the Vite-exposed key at build time (not recommended for production)
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

## Production image
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default nginx config with app config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
