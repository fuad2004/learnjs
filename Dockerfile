FROM node:18.19

RUN npm install pm2 -g

RUN git clone https://github.com/fuad2004/learnjs.git

WORKDIR /learnjs/learnjsback
RUN npm install
RUN npm run strapi import -- -f export_20240324155407.tar.gz.enc --force --key fuad2004
RUN npm run build

WORKDIR /learnjs/learnjsvite
COPY ./learnjsvite/.env.local /learnjs/learnjsvite/
RUN npm install
RUN npm run build

WORKDIR /learnjs

EXPOSE 3000
EXPOSE 1337

CMD pm2-runtime start ecosystem.config.cjs