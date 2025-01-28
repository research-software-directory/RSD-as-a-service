// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper.aggregator;

import java.net.URI;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.UUID;

public record RemoteRsdData(
	UUID id,
	URI domain,
	Duration refreshInterval,
	ZonedDateTime refreshedAt,
	Collection<UUID> softwareIds
) {
}
