# PHONY makes possible to call `make commands` from inside the Makefile
.PHONY: dev-docs dev-frontend

# Main commands
# ----------------------------------------------------------------
install:
	docker-compose down --volumes #cleanup phase
	docker-compose build database backend auth scrapers nginx   # exclude frontend and wait for the build to finish
	docker-compose up --scale scrapers=0 -d
	cd frontend && yarn -d
	cd documentation && yarn -d
	# Sleep 15 seconds to be sure that that docker-compose up is running
	sleep 15
	cd data-migration && docker-compose build && docker-compose up
	docker-compose down

dev:
	docker-compose up --scale scrapers=0 -d
	make -j 2 dev-docs dev-frontend # Run concurrently


down:
	docker-compose down


# Helper commands
# -
dev-docs:
	cd documentation && yarn dev

dev-frontend:
	cd frontend && yarn dev
