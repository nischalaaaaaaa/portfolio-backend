FROM node:14
WORKDIR /akhilphenom/backend
COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "npm", "start" ]