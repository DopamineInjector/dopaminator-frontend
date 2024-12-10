FROM node:18 AS builder
WORKDIR /app
COPY ./dopaminator-frontend/package.json ./
RUN npm i
COPY ./dopaminator-frontend .
RUN npm run build

FROM nginx:alpine AS im-serving-app-app-app-like-a-restaurant
COPY --from=builder /app/dist/dopaminator-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
