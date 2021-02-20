FROM cypress/base:12.6.0

WORKDIR /www

COPY ./cypress/package.json ./cypress/package-lock.json ./

RUN npm i --verbose --production \
    && npx cypress verify
