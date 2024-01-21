FROM alpine

WORKDIR /www

RUN apk add --no-cache nodejs npm \
    && npm i serve --verbose -g \
    && apk del npm
