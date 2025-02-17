# Use an official Node.js runtime as the base image
FROM node:23-alpine

WORKDIR /api_gateway

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]