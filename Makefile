# Local build helpers. Run `make` (or `make help`) to list targets.

# Path the site is served under on GitHub Pages (/<repo>); used by `make preview`.
# Taken from the `origin` remote's repo name, falling back to the folder name.
REPO_NAME := $(or $(shell git remote get-url origin 2>/dev/null | sed -E 's|.*/||; s|\.git$$||'),$(notdir $(CURDIR)))
BASE_PATH ?= /$(REPO_NAME)
PORT ?= 4321

.DEFAULT_GOAL := help
.PHONY: help install dev build preview stop clean

help: ## Show available targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-9s %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm ci
	@touch node_modules

install: node_modules ## Install dependencies

dev: node_modules ## Start dev server with live reload
	npx astro dev --port $(PORT)

build: node_modules ## Build the static site into dist/
	npx astro build

preview: node_modules ## Build and serve under /<repo>/, as on GitHub Pages
	BASE_PATH=$(BASE_PATH) npx astro build
	@echo "Open http://localhost:$(PORT)$(BASE_PATH)/"
	BASE_PATH=$(BASE_PATH) npx astro preview --port $(PORT)

stop: ## Stop a preview server left running in the background
	npx astro preview stop

clean: ## Remove build output and caches
	rm -rf dist .astro node_modules/.astro
