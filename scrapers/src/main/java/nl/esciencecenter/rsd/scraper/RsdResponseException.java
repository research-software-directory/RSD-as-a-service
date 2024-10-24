// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

package nl.esciencecenter.rsd.scraper;

import java.net.URI;

public class RsdResponseException extends Exception {

	private static final long serialVersionUID = 1L;

	public final int statusCode;
	public final URI uri;
	public final String body;

	public RsdResponseException(int statusCode, URI uri, String body, String message) {
		super(message);
		this.statusCode = statusCode;
		this.uri = uri;
		this.body = body;
	}
}
