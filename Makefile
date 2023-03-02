# SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 - 2023 dv4all
# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

# PHONY makes possible to call `make commands` from inside the Makefile
.PHONY: start install frontend data dev down dev-docs

# Detect user and group IDs for frontend-dev configuration
USER_OS := $(shell uname -s)
DUID := $(shell /usr/bin/id -u)
ifeq ($(USER_OS), Linux)
	DGID := $(shell /usr/bin/id -g)
endif
# For MacOS use a workaround, id -g in MacOS returns a GID with a low number (usually 20)
# such low GIDs are already used in Linux, so let's create a new one
ifeq ($(USER_OS), Darwin)
	DGID := $(shell dscl . -list /Groups PrimaryGroupID | awk 'BEGIN{i=0}{if($$2>i)i=$$2}END{print i+1}')
endif
export DUID
export DGID

# Main commands
# ----------------------------------------------------------------
start: clean
	docker-compose build # build all services
	docker-compose up --scale data-generation=1 --scale scrapers=0 -d
	# open http://localhost to see the application running

install: clean
	docker-compose build database backend auth scrapers nginx   # exclude frontend and wait for the build to finish
	docker-compose up --scale scrapers=0 -d
	cd frontend && yarn install -d
	cd documentation && yarn install -d
	# Sleep 10 seconds to be sure that docker-compose up is running
	sleep 10
	docker-compose up --scale data-generation=1 -d
	# All dependencies are installed. The data migration is runing in the background. You can now run `make dev' to start the application

clean:
	docker-compose down --volumes


dev:
	docker-compose up --scale scrapers=0 -d
	make -j 2 dev-docs dev-frontend # Run concurrently

stop:
	docker-compose down

frontend-docker: frontend/.env.local
	docker-compose build frontend-dev
	docker-compose up --scale frontend=0 --scale scrapers=0 --scale frontend-dev=1

data:
	docker-compose up --scale data-generation=1 --scale scrapers=0
	sleep 60
	docker-compose down

# Helper commands
# -
dev-docs:
	cd documentation && yarn dev

frontend/.env.local: .env
	@echo "Creating frontend/.env.local"
	cp .env frontend/.env.local
	sed -i 's/POSTGREST_URL=http:\/\/backend:3500/POSTGREST_URL=http:\/\/localhost\/api\/v1/g' frontend/.env.local
	sed -i 's/RSD_AUTH_URL=http:\/\/auth:7000/RSD_AUTH_URL=http:\/\/localhost\/auth/g' frontend/.env.local

dev-frontend: frontend/.env.local
	cd frontend && yarn dev

# run end-to-end test locally
e2e-tests:
	docker-compose down --volumes
	docker-compose build --parallel database backend auth frontend nginx
	docker-compose up --detach --scale scrapers=0
	sleep 10
	docker-compose --file e2e/docker-compose.yml build
	docker-compose --file e2e/docker-compose.yml up
	docker-compose down
	docker-compose --file e2e/docker-compose.yml down
