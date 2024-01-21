FROM alpine AS sa

WORKDIR /www

RUN apk add --no-cache nodejs npm

COPY node-explorer/package.json node-explorer/package-lock.json ./

RUN npm i --verbose

COPY node-explorer/.env \
     node-explorer/.sequelizerc \
     ./
COPY node-explorer/database ./database
COPY node-explorer/src ./src

ENV DB_DIALECT=sqlite
RUN mkdir var \
    && npm run sql db:migrate \
    && npm run sql db:seed:all

RUN npm run build
