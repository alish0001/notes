FROM node:latest
WORKDIR /usr/src/app
copy package*.json .
RUN npm ci
COPY . .
CMD ["npm", "start"]