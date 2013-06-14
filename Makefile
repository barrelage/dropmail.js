MAKEFLAGS += --check-symlink-times

DROPMAIL_MIN_JS = build/dropmail.min.js

default: install build

build: $(DROPMAIL_MIN_JS)

watch:
	@while :; do make build; sleep 1; done

$(DROPMAIL_MIN_JS):
	@node build

install: node_modules

node_modules:
	@npm install
