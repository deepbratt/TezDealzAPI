FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY .npmrc ./

RUN npm install

COPY . .

EXPOSE 3006

CMD [ "npm", "start" ]