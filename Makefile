.DEFAULT_GOAL		:= interactive

DOCKER_IMAGE_ALIAS	:= exploreme
DOCKER_IMAGE_LOCAL	:= $(DOCKER_IMAGE_ALIAS)-cwa
DOCKER_IMAGE_PROD	:= $(DOCKER_IMAGE_ALIAS)-cwa-production

.PORT 				:= 8080
.REACT_APP_GRAPHQL 	:= //localhost:8081

PORT				:= $(.PORT)
REACT_APP_GRAPHQL 	:= $(.REACT_APP_GRAPHQL)

.SHARED_VOLUMES := \
	-v $(PWD)/public:/www/public \
	-v $(PWD)/src:/www/src \
	-v $(PWD)/.env:/www/.env \
	-v $(PWD)/tsconfig.json:/www/tsconfig.json

.ENV_VARIABLES := \
	-e PORT=$(PORT) \
	-e REACT_APP_GRAPHQL=$(REACT_APP_GRAPHQL)

help:
	@echo ""
	@echo "-------------------------------------------------"
	@echo "-------- 'Explore Me' React.js front-end --------"
	@echo "-------------------------------------------------"
	@echo ""
	@echo " make help\t\tdisplay help"
	@echo ""
	@echo "-- GIT SYNC MODULES"
	@echo " make sync\t\talias for 'git submodule update --init --recursive --remote'"
	@echo ""
	@echo "-- DOCKER IMAGE PREPARATION"
	@echo " make dev-image\t\tbuild [$(DOCKER_IMAGE_LOCAL)] image which encapsulate dev-dependencies, nothing else"
	@echo " make serve-image\tbuild [$(DOCKER_IMAGE_PROD)] image which encapsulate 'serve', nothing else"
	@echo ""
	@echo "-- DOCKER ORCHESTRATION"
	@echo " make cy-image\t\tbuild CWA, GraphQL, Cypress docker images for 'end to end' test execution"
	@echo ""
	@echo "-- COMMANDS"
	@echo " make\t\t\talias for 'make $(.DEFAULT_GOAL)'"
	@echo " make interactive\trun [$(DOCKER_IMAGE_LOCAL)] image, content become available on http://localhost:$(PORT)"
	@echo " make serve\t\trun [$(DOCKER_IMAGE_PROD)] image, content become available on http://localhost:$(PORT)"
	@echo " make test\t\texecute unit and functional tests"
	@echo " make cypress\t\texecute 'cypress' integration tests"
	@echo " make build\t\tgenerate static assets in './build' directory"
	@echo ""
	@echo "-- ARGUMENTS"
	@echo " argument\t\tdefault"
	@echo " PORT\t\t\t$(.PORT)"
	@echo " REACT_APP_GRAPHQL\t$(.REACT_APP_GRAPHQL)"

# sync:
# 	git submodule update --init --recursive --remote

# image-cypress:
# 	docker-compose -f cypress.compose.yml build

image-local:
	docker build -t $(DOCKER_IMAGE_LOCAL) . -f env.local.Dockerfile

image-prod:
	docker build -t $(DOCKER_IMAGE_PROD) . -f env.prod.Dockerfile

build: image-local
	mkdir -p $(PWD)/build
	docker run \
		--rm \
		-it \
		-v $(PWD)/build:/www/build \
		$(.SHARED_VOLUMES) \
		$(.ENV_VARIABLES) \
		--entrypoint=npm \
		$(DOCKER_IMAGE_LOCAL) run build

test: image-local
	docker run \
		--rm \
		--name explorer-cwa-test \
		-it \
		$(.SHARED_VOLUMES) \
		$(.ENV_VARIABLES) \
		--entrypoint=npm \
		$(DOCKER_IMAGE_LOCAL) run test

# cypress: image-cypress
# 	docker-compose -f cypress.compose.yml up --abort-on-container-exit

interactive: image-local
	docker run \
		--rm \
		--name $(DOCKER_IMAGE_LOCAL)-$(PORT) \
		-it \
		$(.SHARED_VOLUMES) \
		$(.ENV_VARIABLES) \
		-p $(PORT):$(PORT) \
		--entrypoint=npm \
		$(DOCKER_IMAGE_LOCAL) run start

serve: build image-prod
	docker run \
		--rm \
		--name $(DOCKER_IMAGE_PROD)-$(PORT) \
		-it \
		-v $(PWD)/build:/www/build \
		-v $(PWD)/serve.json:/www/serve.json \
		-e NO_UPDATE_CHECK=1 \
		$(.ENV_VARIABLES) \
		-p $(PORT):$(PORT) \
		--entrypoint=serve \
		$(DOCKER_IMAGE_PROD) -n
