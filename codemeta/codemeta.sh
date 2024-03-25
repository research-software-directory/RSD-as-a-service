# SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

printenv > /etc/environment &&
service cron start &&
/usr/local/bin/app
