FROM node:18.16.0-alpine as base

RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm ci

COPY src /app/src
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json
COPY static /app/static

EXPOSE 5000
CMD ["npm", "run", "start"]