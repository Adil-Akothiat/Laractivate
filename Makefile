# ==============================================================================
# 1. ARGUMENT PARSER
# ==============================================================================
# If the first command is one of our dynamic targets, extract everything else as ARGS
SUPPORTED_TARGETS := art comp run stripe-cli db-shell client
FIRST_CMD := $(firstword $(MAKECMDGOALS))

ifneq ($(filter $(FIRST_CMD),$(SUPPORTED_TARGETS)),)
  ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
endif

# ==============================================================================
# 2. CONFIGURATION & VARIABLES
# ==============================================================================
c ?= app
COMPOSE=docker compose
EXEC=$(COMPOSE) exec $(c)

# Tell Make these are logical commands, not physical files/folders
.PHONY: up down restart rebuild logs ps shell art comp run db-shell stripe-cli client

# ==============================================================================
# 3. INFRASTRUCTURE TARGETS
# ==============================================================================

up:
	@$(COMPOSE) up
up-d:
	@$(COMPOSE) up -d

down:
	@$(COMPOSE) down
down-v:
	@$(COMPOSE) down -v

restart:
	@$(COMPOSE) down && $(COMPOSE) up -d

rebuild:
	@$(COMPOSE) up -d --build

logs:
	@$(COMPOSE) logs -f $(c)

ps:
	@$(COMPOSE) ps

shell:
	@$(EXEC) sh

# ==============================================================================
# 4. DYNAMIC CLI TARGETS
# ==============================================================================

art:
	@$(COMPOSE) exec app php artisan $(ARGS)

comp:
	@$(COMPOSE) exec app composer $(ARGS)

run:
	@$(EXEC) $(ARGS)

client:
	@$(COMPOSE) exec client $(ARGS)

db-shell:
	@$(COMPOSE) exec $(if $(filter app,$(c)),db,$(c)) mysql -u root -p$(ARGS)

stripe-cli:
	@$(COMPOSE) exec stripe-cli stripe $(ARGS)

# ==============================================================================
# 5. THE SILENT CATCH-ALL (Crucial for arguments like db:seed)
# ==============================================================================
# This matches any trailing argument that isn't a defined target and does absolutely nothing.
%:
	@: