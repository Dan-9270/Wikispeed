FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

ENV SOLVER_PORT=3001
ENV SOLVER_HOST=0.0.0.0

EXPOSE 3001

CMD ["npm", "run", "start"]
