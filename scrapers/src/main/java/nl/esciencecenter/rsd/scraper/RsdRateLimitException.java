// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import java.net.URI;

public class RsdRateLimitException extends RuntimeException {

	public final int statusCode;
	public final URI uri;
	public final String body;

	public RsdRateLimitException(int statusCode, URI uri, String body, String message) {
		super(message);
		this.statusCode = statusCode;
		this.uri = uri;
		this.body = body;
	}
}
