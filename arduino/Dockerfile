# Step 1 : Base Images
FROM mongo

# Step 2 : Package Install
RUN apt -y update; apt -y upgrade; apt -y install vim git net-tools

FROM node:18.20.0

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN npm install -g pm2

COPY . .

EXPOSE 3000

CMD ["node","app.js"]