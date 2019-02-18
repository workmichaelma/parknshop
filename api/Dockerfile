FROM node:10

WORKDIR /usr/src/app/api

COPY package.json /usr/src/app/api

RUN npm install

COPY . /usr/src/app/api

EXPOSE 3000

CMD npm run start