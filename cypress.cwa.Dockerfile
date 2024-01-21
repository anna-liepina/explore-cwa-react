FROM alpine AS cwa

WORKDIR /www

RUN apk add --no-cache nodejs npm

COPY package.json package-lock.json ./

RUN npm i --verbose

COPY public ./public
COPY src ./src
COPY .env ./

ARG REACT_APP_GRAPHQL
ENV REACT_APP_GRAPHQL=$REACT_APP_GRAPHQL

RUN npm run build

###################################################
## 'serve' image with encapsulated static assets ##
###################################################

FROM alpine

WORKDIR /www

RUN apk add --no-cache nodejs npm \
    && npm i serve --verbose -g \
    && apk del nodejs-npm

COPY serve.json ./
COPY --from=cwa /www/build /www/build
