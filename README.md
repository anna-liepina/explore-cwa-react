[ci.tests-master-badge]: https://circleci.com/gh/anna-liepina/explore-cwa-react/tree/master.svg?style=svg
[ci.tests-master]: https://circleci.com/gh/anna-liepina/explore-cwa-react/tree/master
[ci.coverage-master-badge]: https://codecov.io/gh/anna-liepina/explore-cwa-react/branch/master/graph/badge.svg
[ci.coverage-master]: https://codecov.io/gh/anna-liepina/explore-cwa-react/branch/master

[ci.tests-heroku-badge]: https://circleci.com/gh/anna-liepina/explore-cwa-react/tree/heroku.svg?style=svg
[ci.tests-heroku]: https://circleci.com/gh/anna-liepina/explore-cwa-react/tree/heroku
[ci.coverage-heroku-badge]: https://codecov.io/gh/anna-liepina/explore-cwa-react/branch/heroku/graph/badge.svg
[ci.coverage-heroku]: https://codecov.io/gh/anna-liepina/explore-cwa-react/branch/heroku

|               | master                                                        | heroku
|---            |---                                                            | ---
| __tests__     | [![tests][ci.tests-master-badge]][ci.tests-master]            | [![tests][ci.tests-heroku-badge]][ci.tests-heroku]
| __coverage__  | [![coverage][ci.coverage-master-badge]][ci.coverage-master]   | [![coverage][ci.coverage-heroku-badge]][ci.coverage-heroku]

# 'Explore Me CWA' [client web application]

This project is centered around parsing various datasets, including UK government data on property sales, police reporting data, and post code data. The goal is to harness geographical information to establish connections between postcodes using latitude and longitude.

The primary objective is to develop a scalable GraphQL backend capable of swiftly delivering requested results. This endeavor seeks to illuminate intricate aspects of GraphQL use, addressing challenges like the N+1 problem and scaling scenarios where more than one database is required for both write and read nodes.

Key features of the project include a robust automated Quality Assurance (QA) system, incorporating anonymized data seeding for comprehensive QA testing. The project also explores the flexibility of JavaScript, pushing the boundaries of the language. Notably, it delves into the constraints of default V8 object fields, which are capped at around ~8.4 million, while highlighting the superior handling capacity of the Map data structure.

Additionally, the project incorporates a queue system to enhance the efficiency of data processing. In essence, project serves as a practical demonstration of diverse and advanced aspects of software development, reflecting a commitment to excellence and innovation.

### Live DEMO

* Web Application [https://exploreme.co.uk]
  * GraphQL [https://dolphin-app-3qow6.ondigitalocean.app]

### software requirements

if you're using `make` commands, __[docker](https://docs.docker.com/install/)__ and __[docker-compose](https://docs.docker.com/compose/install/)__ are required, and local __[node.js](https://nodejs.org/)__ with __[npm](https://www.npmjs.com/)__ are optional
* [node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* __optional__ [makefile](https://en.wikipedia.org/wiki/Makefile) comes out of the box in *unix* enviroments
* __optional__ [docker](https://www.docker.com/) v18.09+
* __optional__ [docker-compose](https://docs.docker.com/compose/) v3+ *for 'cypress' tests only*

### used technologies

* [react.js](https://reactjs.org/)
* [sass](https://sass-lang.com/)
* [jest](https://facebook.github.io/jest/)
* [react testing library](https://testing-library.com/docs/react-testing-library/intro)
* [cypress](https://www.cypress.io/)

### used services

* [circle ci](https://circleci.com/dashboard)
* [codecov](https://codecov.io/)
* [code climate](https://codeclimate.com/)
* [snyk](https://snyk.io/)

### how to install

* with `make` commands no steps additional required, otherwise you need execute `$ npm i`

### how to run tests

* end to end 'cypress' tests: `$ make sync` to fetch GraphQL backend as git submodule, then `$ make cypress`
  * _npm analogue_ require booting up [CWA](https://github.com/anna-lipina/explore-cwa-react) & [SA](https://github.com/anna-lipina/explore-sa-node/) and link them together, then `cd cypress && npm test`
* functional 'jest' tests: `$ make test` or `$ npm test`
  * __optional__ [ 'jest' CLI params](https://facebook.github.io/jest/docs/en/cli.html), examples:
    * to collect coverage, example: `$ npm test -- --coverage`, report will be located in __./coverage__ directory
    * to run tests __only__ in specific file, example: `$ npm test src/validation/rules.test.js`

### how to run in 'development' mode

* `$ make` or `$ npm start`

### how to run in 'production' mode

* `$ make serve`, there is no *npm* equivalent
* if you __only__ need to generate static assets
  * `$ make build` or `$ npm run build` - generated assets will be located in __./build__ directory

### how to run containers with different variables using 'make'

* example: `make PORT=18080`

### gitflow

* *heroku* -> current __production__, contains *production specific changes*, trigger deploy on AWS on *every push*
* *master* -> most upto date __production ready__, all pull requests in to this branch got mandatory checks 'ci/circleci: jest' and 'ci/circleci: cypress'
* *feature branches* -> get merged into master branch, when they ready and mandatory checks passed
* *CI execute tests in isolated enviroment*

### used environment variables

| variable          | default value     | used as   | purpose
|---                |---                |---        |---
| PORT              | 8080              | number    | port on which the application will be made available
| REACT_APP_GRAPHQL | //localhost:8081  | string    | GraphQL backend URI
| REACT_APP_TITLE   | DATA EXPLORER     | string    | website's title


### DEMO 
