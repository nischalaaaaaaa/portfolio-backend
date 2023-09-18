FROM node:14
WORKDIR /akhilphenom/backend
COPY package*.json ./
RUN npm ci
EXPOSE 3000
COPY . .
CMD [ "npm", "start" ]