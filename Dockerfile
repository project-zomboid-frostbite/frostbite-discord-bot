# syntax=docker/dockerfile:1
FROM node:20-alpine

RUN mkdir -p /usr/share/app
WORKDIR /usr/share/app

COPY package.json package-lock.json tsconfig.json ./
COPY ./src ./src

RUN npm ci
RUN npm run build

CMD ["NO_COLOR=1", "npm", "run", "start:prod"]
