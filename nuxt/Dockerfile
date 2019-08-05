FROM node:latest

WORKDIR /usr/src/app/nuxt

COPY package.json /usr/src/app/nuxt

RUN npm install npm@latest -g
# RUN npm install

COPY . /usr/src/app/nuxt

# RUN npm install
RUN npm run build

EXPOSE 8083

CMD npm run dev
