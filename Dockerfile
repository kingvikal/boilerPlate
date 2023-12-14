FROM node:16-alpine
WORKDIR /app
COPY package.json  ./
RUN npm --frozen-lockfile
COPY . .
CMD npm start
