# === Stage 1: Build Angular app
FROM node:22-alpine AS build
RUN apk --no-cache upgrade

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm ci --no-audit --no-fund

# Copy source code and build
COPY . .
RUN npm run build -- --configuration=production


# === Stage 2: Nginx
FROM nginx:1.31-alpine
RUN apk --no-cache upgrade

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/cody-color-client/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
