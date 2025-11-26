SHELL := /bin/bash

DC := docker compose -f docker-compose.yml

# Uncomment one of the following lines to use a specific override file
DC := $(DC) -f docker-compose.custom.yml
# DC := $(DC) -f docker-compose.local.yml

.PHONY: cmd
cmd:
	@echo 'Docker compose command:'
	@echo '${DC}'

.PHONY: up
up:
	${DC} up -d
	${DC} ps
	@echo
	@echo 'CodyColor client service is now up'
	@echo

.PHONY: rebuild
rebuild:
	${DC} rm -sf server
	${DC} build server
	${DC} up -d --force-recreate

.PHONY: rebuild-full
rebuild-full:
	${DC} down -v         # stop and remove containers & volumes
	docker image prune -f  # optional: remove dangling images
	${DC} build --no-cache
	${DC} up -d
	${DC} ps

.PHONY: ps
ps:
	${DC} ps

.PHONY: rs
rs:
	${DC} restart

.PHONY: stop
stop:
	${DC} stop

.PHONY: rm
rm:
	${DC} rm -fs
