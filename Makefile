all: public/cookies-manager.json

.PHONY: public/cookies-manager.json
public/cookies-manager.json:
	bun scripts/build.ts
	bunx prettier --write public/cookies-manager.json
