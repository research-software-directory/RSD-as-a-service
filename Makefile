# SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

# PHONY makes possible to call `make commands` from inside the Makefile
.PHONY: dev-docs dev-frontend

# Main commands
# ----------------------------------------------------------------
start:
	docker-compose down --volumes #cleanup phase
	docker-compose build # build all services
	docker-compose up  --scale scrapers=0 -d
	# Sleep 30 seconds to be sure that docker-compose up is running
	sleep 30
	cd data-migration && docker-compose build && docker-compose up
	# open http://localhost to see the application running

install:
	docker-compose down --volumes #cleanup phase
	docker-compose build database backend auth scrapers nginx   # exclude frontend and wait for the build to finish
	docker-compose up --scale scrapers=0 -d
	cd frontend && yarn -d
	cd documentation && yarn -d
	# Sleep 30 seconds to be sure that docker-compose up is running
	sleep 30
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

frontend/.env.local: .env
	@echo "Creating frontend/.env.local"
	cp .env frontend/.env.local
	sed -i 's/POSTGREST_URL=http:\/\/backend:3500/POSTGREST_URL=http:\/\/localhost\/api\/v1/g' frontend/.env.local

dev-frontend: frontend/.env.local
	cd frontend && yarn dev
