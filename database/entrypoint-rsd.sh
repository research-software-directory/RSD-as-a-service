#!/bin/bash

# SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

printenv > /cron-env
#service cron start

exec docker-entrypoint.sh postgres
