FROM node:20-alpine3.17
##USER node
WORKDIR /app
COPY package.json .
RUN npm cache clean --force
RUN npm install --force
COPY . .
RUN npm run build
ENV PORT 4000
EXPOSE $PORT
