FROM node:latest

WORKDIR /usr/src/app/app

COPY package.json /usr/src/app/app

COPY . /usr/src/app/app

RUN npm install

EXPOSE 3000

CMD npm run dev