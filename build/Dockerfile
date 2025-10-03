FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

COPY ./contents ./
COPY settings.js ./js

CMD ["nginx", "-g", "daemon off;"]
