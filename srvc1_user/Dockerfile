# Use an official Node.js runtime as the base image
FROM node:23-alpine

WORKDIR /srvc1_user

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]