FROM node:18.13.0-alpine as build

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci
COPY . /app
RUN npm run build

FROM nginx:1.18-alpine
COPY nginx/ssl/fullchain.pem /etc/nginx/conf.d/fullchain.pem
COPY nginx/ssl/privkey.pem /etc/nginx/conf.d/privkey.pem
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]