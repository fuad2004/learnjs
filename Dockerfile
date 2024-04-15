FROM node:18.19

WORKDIR /app

RUN mkdir -p learnjsback

RUN mkdir -p learnjsvite

RUN npm install pm2 -g

COPY ./learnjsback/package*.json ./learnjsback

COPY ./learnjsvite/package*.json ./learnjsvite

COPY . .

WORKDIR /app/learnjsback

RUN npm install

RUN npm run strapi import -- -f export_20240324155407.tar.gz.enc --force --key fuad2004

RUN npm run build

WORKDIR /app/learnjsvite

RUN npm install

RUN npm run build

WORKDIR /app

EXPOSE 3000

EXPOSE 1337

CMD pm2-runtime start ecosystem.config.cjs