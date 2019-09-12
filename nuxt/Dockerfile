FROM node:latest

WORKDIR /usr/src/app/nuxt

COPY . /usr/src/app/nuxt
RUN npm install

# COPY . /usr/src/app/nuxt

# RUN npm install
RUN npm run build

EXPOSE 8083

CMD npm install && npm run build && npm run start
# CMD npm run dev
#CMD npm run build && npm run start
