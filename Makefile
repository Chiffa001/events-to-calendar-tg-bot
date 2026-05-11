.PHONY: run dev install typecheck lint format check setup auth docker-build docker-run docker-logs docker-stop help

run:
	npm run start

dev:
	npm run dev

install:
	npm install

typecheck:
	npm run typecheck

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

check: typecheck lint

setup:
	cp -n .env.example .env && echo "Created .env — fill in your tokens" || echo ".env already exists"

auth:
	npm run auth

docker-build:
	docker build -t tg-calendar-ai .

docker-run: docker-build
	docker run -d --restart unless-stopped --env-file .env --name tg-calendar-ai tg-calendar-ai

docker-logs:
	docker logs -f tg-calendar-ai

docker-stop:
	docker stop tg-calendar-ai && docker rm tg-calendar-ai

help:
	@echo "Available commands:"
	@echo "  make run        — start the bot"
	@echo "  make dev        — start with hot reload"
	@echo "  make install    — install dependencies"
	@echo "  make typecheck  — type-check with tsc"
	@echo "  make setup      — create .env from example"
	@echo "  make auth         — run one-time Google OAuth flow"
	@echo "  make docker-build — build Docker image"
	@echo "  make docker-run   — build and run bot in Docker (detached)"
	@echo "  make docker-logs  — follow container logs"
	@echo "  make docker-stop  — stop and remove container"
