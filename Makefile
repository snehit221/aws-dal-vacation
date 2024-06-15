.PHONY: check-tools
check-tools:
	node -v
	terraform -v
	yarn -v
	cdktf --version

build-ui:
	pnpm --dir ui build

.PHONY: deploy
deploy:
	cd infra && cdktf deploy

.PHONy: destroy
destroy:
	cd infra && cdktf destroy