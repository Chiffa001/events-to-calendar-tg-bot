.PHONY: run dev install typecheck lint format check setup auth help

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

help:
	@echo "Available commands:"
	@echo "  make run        — start the bot"
	@echo "  make dev        — start with hot reload"
	@echo "  make install    — install dependencies"
	@echo "  make typecheck  — type-check with tsc"
	@echo "  make setup      — create .env from example"
	@echo "  make auth       — run one-time Google OAuth flow"
