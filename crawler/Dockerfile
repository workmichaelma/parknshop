FROM node:10

WORKDIR /usr/src/app/crawler

COPY package.json /usr/src/app/crawler

RUN npm install

COPY . /usr/src/app/crawler

EXPOSE 8082

CMD npm run start