FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 procps \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY chatserver/package.json chatserver/package-lock.json ./chatserver/

RUN npm ci
RUN npm ci --prefix chatserver

COPY . .

RUN npm run build:docker

ENV PORT=8080
ENV API_PORT=3000
ENV SOLVER_PORT=3001
ENV WS_PORT=2025

EXPOSE 8080

CMD ["npm", "run", "start:docker"]
