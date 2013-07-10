SHELL=/bin/bash
MAKEFLAGS += --check-symlink-times

DROPMAIL_SOURCE = $(shell find {lib,browser} -name "*.js")
DROPMAIL_JS = build/dropmail.js build/dropmail.min.js

color-line  = \r\033[$(1)m$(2) \033[0m$(3)\033[K
log-info    = echo -e "$(call color-line,90,   $(1),$(2))"
log-success = echo -e "$(call color-line,92,✔  $(1),$(2))"

default: install build

build: $(DROPMAIL_JS)

quiet: build
	@echo > /dev/null

watch:
	@while :; do \
		make quiet; \
		spin=(/ - \\ \|) \
		  && next=$${spin[$$(expr $$(date +%s) % 4)]} \
			&& echo -e -n "$(call color-line,90,=> Watching for changes... $${next})"; \
		sleep 1; \
	done

$(DROPMAIL_JS): $(DROPMAIL_SOURCE)
	@$(call log-info,compiling dropmail.js...)
	@node build
	@$(call log-success,compiled,$(1))

lint: node_modules
	@./node_modules/.bin/jshint $(DROPMAIL_SOURCE)

clean:
	rm -f $(DROPMAIL_JS)

install: node_modules

node_modules:
	@npm install

.PHONY: lint
