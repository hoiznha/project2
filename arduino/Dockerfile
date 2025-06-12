FROM node:18.20.0

WORKDIR /usr/src/app
COPY arduino/package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","app.js"]